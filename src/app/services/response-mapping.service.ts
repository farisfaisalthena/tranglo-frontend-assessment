import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { IExchangeRateStateResponse } from '../interfaces';
import {
  SelectExchangeRate,
  SelectExchangeRateError,
  SelectExchangeRateLoading
} from '../stores/exchange-rate';

@Injectable({
  providedIn: 'root'
})
export class ResponseMappingService {

  private store = inject(Store);

  getLatestExchangeRate(): Observable<IExchangeRateStateResponse> {
    return combineLatest([
      this.store.select(SelectExchangeRateLoading),
      this.store.select(SelectExchangeRate),
      this.store.select(SelectExchangeRateError)
    ]).pipe(map(([loading, data, error]) => ({ loading, data, error })));
  };
};
