import { Injectable } from '@angular/core';

const CACHE_KEY: string = '_cachedata_';

@Injectable({
  providedIn: 'root'
})
export class ApiCachingService {

  /** Caching requests */
  cacheRequests<T>(url: string, data: T, cacheDuration: number) {
    const validUntil = (new Date().getTime()) + cacheDuration * 1000;
    url = `${CACHE_KEY}${url}`;

    return localStorage.setItem(url, JSON.stringify({ validUntil, data }));
  }

  /** Getting cached requests */
  getCachedRequest<T>(url: string): T | null {
    const currentTime = new Date().getTime();
    url = `${CACHE_KEY}${url}`;

    const value = localStorage.getItem(url);

    if (value === null) {
      return null;
    } else if (JSON.parse(value).validUntil < currentTime) {
      localStorage.removeItem(url);

      return null;
    } else {
      return JSON.parse(value).data;
    };
  };
};
