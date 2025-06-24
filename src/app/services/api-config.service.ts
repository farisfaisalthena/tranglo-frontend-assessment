import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Observable,
  switchMap,
  from,
  tap,
  of,
  catchError,
  timeout,
  EMPTY,
  NEVER,
  throwError
} from 'rxjs';

import { ApiCachingService, ConfigService } from './';
import { IHttpGetConfig, IHttpPostConfig } from '../interfaces';
import { environment } from '@src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  private httpClient = inject(HttpClient);
  private apiCaching = inject(ApiCachingService);
  private config = inject(ConfigService);
  private apiUrl: string = environment.apiUrl;

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

  /**
   * POST: Simple request API.
   *
   * @param endpoint - <apiUrl><endpoint> for service
   * @param options.body - request body (default: null)
   * @param options.headers - http headers (default: {})
   * @param options.params - additional request parameters (default: {})
   * @param options.url - url of web service (default: apiUrl)
   * @return data observable
   */
  post<T>(endpoint: string, options: IHttpPostConfig = {}): Observable<T> {
    options = {
      body: null,
      headers: {},
      params: {},
      url: this.apiUrl,
      ...options
    };

    const url = options.url + endpoint;
    const opt = {
      params: options.params,
      headers: options.headers
    };

    return this.config.networkStatus$.pipe(
      switchMap(status => {
        if (!status) {
          this.config.showToastMessage('Some of the date will not be accessible as you are not connected on an Internet.');
          throw new Error('No internet connection');
        };

        return this.httpClient.post<T>(url, options.body, opt).pipe(
          catchError(this.handleClientError),
          timeout(10000)
        );
      })
    );
  };

  private convertHoursToSeconds(hours: number): number {
    return Math.round(hours * 3600);
  };

  /** Handle client error by rethrowing 4xx or return empty observable for 304. */
  private handleClientError(err: HttpErrorResponse): Observable<never> {
    if (400 <= err.status && err.status < 500) {
      return throwError(() => err);
    } else if (err.status === 304) {
      return EMPTY;
    } else {
      console.error('Unknown http error response', err);
      return NEVER;
    };
  };
};
