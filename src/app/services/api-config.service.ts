import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Observable,
  switchMap,
  from,
  tap,
  of
} from 'rxjs';

import { ApiCachingService, ConfigService } from './';
import { IHttpGetConfig } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  private httpClient = inject(HttpClient);
  private apiCaching = inject(ApiCachingService);
  private config = inject(ConfigService);
  private apiUrl: string = '';

  /**
   * GET: Request API with cache.
   *
   * @param endpoint - endpoint from each url
   * @param options.headers - http headers (default: {})
   * @param options.params - additional request parameters (default: {})
   * @param options.url - url of web service (default: apiUrl)
   * @param options.forceRefresh - determine whether load new data or get from locally stored (default: true)
   * @param options.cacheDuration - how long is data stored locally (default: 36000 - 10 Hours)
   * @return data as Observable
   */
  get<T>(endpoint: string, options: IHttpGetConfig = {}): Observable<T> {
    options = {
      headers: {},
      params: {},
      body: null,
      url: this.apiUrl,
      force_refresh: true,
      cache_duration: this.convertHoursToSeconds(10),
      ...options
    };

    const url = options.url + endpoint;
    const opt = {
      params: options.params,
      headers: options.headers
    };

    if (options.force_refresh) {
      return this.config.networkStatus$.pipe(
        switchMap(status => {
          if (!status) {
            this.config.showToastMessage('Some of the date will not be accessible as you are not connected on an Internet.');
            return from(this.apiCaching.getCachedRequest(url) as Promise<T>);
          };

          return this.httpClient.get<T>(url, opt).pipe(
            tap(res => {
              this.apiCaching.cacheRequests(url, res, options.cache_duration!);
            })
          );
        })
      );
    };

    const storedData: Observable<T | null> = from(this.apiCaching.getCachedRequest(url) as Promise<T | null>);

    return storedData.pipe(
      switchMap(results => {
        if (!results) {
          return this.httpClient.get<T>(url, opt).pipe(
            tap(res => {
              this.apiCaching.cacheRequests(url, res, options.cache_duration!);
            })
          );
        } else {
          return of(results);
        };
      })
    );
  };

  convertHoursToSeconds(hours: number): number {
    return Math.round(hours * 3600);
  };
};
