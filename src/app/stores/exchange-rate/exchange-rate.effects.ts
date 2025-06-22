import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap, map, catchError, of, withLatestFrom, exhaustMap, filter, mergeMap, interval } from 'rxjs';

import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT
} from '@ngrx/effects';
import { Store } from '@ngrx/store';


import { ApiService, ConfigService } from '../../services';
import {
  LoadExchangeRate,
  LoadExchangeRateFailure,
  LoadExchangeRateSuccess,
  RefreshExchangeRate,
  SelectExchangeRate,
  SelectExchangeRateLoading
} from './';
import { SelectAutoRefreshEnabled, SelectBaseCurrency, SetBaseCurrency } from '../configs';
import { REFRESH_TIMER_IN_MS } from '../../constants';

@Injectable()
export class ExchangeRateEffects {

  private api = inject(ApiService);
  private actions$ = inject(Actions);
  private store = inject(Store);
  private config = inject(ConfigService);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      withLatestFrom(this.store.select(SelectBaseCurrency)),
      map(([_, base_currency]) => LoadExchangeRate({ base_currency, force: false }))
    )
  );

  manualRefresh$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RefreshExchangeRate),
      withLatestFrom(this.store.select(SelectBaseCurrency)),
      map(([_, base_currency]) => LoadExchangeRate({ base_currency, force: true }))
    )
  );

  autoRefresh$ = createEffect(() =>
    this.store.select(SelectAutoRefreshEnabled).pipe(
      switchMap((enabled) =>
        enabled
          ? interval(REFRESH_TIMER_IN_MS).pipe(
            withLatestFrom(this.store.select(SelectExchangeRateLoading)),
            filter(([_, loading]) => !loading),
            map(() => RefreshExchangeRate())
          )
          : of()
      )
    )
  );

  // 3) Base‐currency change → force reload
  baseChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SetBaseCurrency),
      map(({ currency }) => LoadExchangeRate({ base_currency: currency, force: true }))
    )
  );

  // 4) Actual HTTP call
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadExchangeRate),
      switchMap(({ base_currency, force }) =>
        this.api.getLatestExchangeRate(base_currency, force).pipe(
          map((res) => LoadExchangeRateSuccess({
            base_currency,
            data: res.data,
            last_updated: res.last_updated,
            last_refresh: new Date(),
          })),
          catchError((error: HttpErrorResponse) => {
            const errorMessage: string = error?.error?.message || 'Unknown error occured. Please try again.';

            return of(LoadExchangeRateFailure({ error: errorMessage }));
          })
        )
      )
    )
  );
};
