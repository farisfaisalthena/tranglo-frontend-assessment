import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';

import { ApiConfigService } from './';
import {
  IExchangeRateData,
  IExchangeRates,
  IFormattedExchangeRates,
  ISupportedCurrency,
  ISupportedCurrencyResponse
} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiConfig = inject(ApiConfigService);

  getSupportedCurrency(): Observable<ISupportedCurrencyResponse[]> {
    return this.apiConfig.get<ISupportedCurrency>('/codes', { force_refresh: false, cache_duration: 12 }).pipe(
      map(res => res.supported_codes.map(([code, name]) => ({ code, name })))
    );
  };

  getLatestExchangeRate(baseCurrency: string, forceRefresh: boolean = false): Observable<IFormattedExchangeRates> {
    return this.getSupportedCurrency().pipe(
      switchMap(currencies => {
        return this.apiConfig.get<IExchangeRates>(`/latest/${baseCurrency}`, { force_refresh: forceRefresh }).pipe(
          map(res => {
            const data: IExchangeRateData[] = Object.entries(res.conversion_rates).map(
              ([code, rate]) => {
                const name = currencies.find((c) => c.code === code)?.name ?? code;

                return { code, name, rate };
              }
              // Filter rate 1 because we assume when rate is one, it means were using it as base currency
            ).filter(dt => dt.rate !== 1);


            return {
              last_updated: new Date(res.time_last_update_unix * 1000),
              data
            };
          })
        )
      })
    );
  };
};
