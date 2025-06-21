import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

const CACHE_KEY: string = '_cachedata_';

@Injectable({
  providedIn: 'root'
})
export class ApiCachingService {

  /** Caching requests */
  cacheRequests<T>(url: string, data: T, cacheDuration: number) {
    const validUntil = (new Date().getTime()) + cacheDuration * 1000;
    url = `${CACHE_KEY}${url}`;

    return Preferences.set({ key: url, value: JSON.stringify({ validUntil, data }) });
  }

  /** Getting cached requests */
  async getCachedRequest<T>(url: string): Promise<T | null> {
    const currentTime = new Date().getTime();
    url = `${CACHE_KEY}${url}`;

    const { value } = await Preferences.get({ key: url });

    if (value === null) {
      return null;
    } else if (JSON.parse(value).validUntil < currentTime) {
      await Preferences.remove({ key: url });
      return null;
    } else {
      return JSON.parse(value).data;
    };
  };
};
