import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiConfigService } from './';
import {
  IExchangeRateData,
  IExchangeRates,
  IFormattedExchangeRates,
  IHistoricalExchangeRatePayload,
  IHistoricalExchangeRateResponse
} from '../interfaces';
import { GetCurrencyData } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiConfig = inject(ApiConfigService);

  getLatestExchangeRate(baseCurrency: string, forceRefresh?: boolean): Observable<IFormattedExchangeRates> {
    return this.apiConfig.get<IExchangeRates>(`/latest-exchange-rate/${baseCurrency}`, { force_refresh: forceRefresh }).pipe(
      map(res => {
        const data: IExchangeRateData[] = Object.entries(res.conversion_rates).map(
          ([code, rate]) => {
            const name = GetCurrencyData.find((c) => c.code === code)?.name ?? code;

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
  };

  getHistoricalExchangeRate(body: IHistoricalExchangeRatePayload) {
    return this.apiConfig.post<IHistoricalExchangeRateResponse>('/exchange-rate-history', { body });
  };
};
