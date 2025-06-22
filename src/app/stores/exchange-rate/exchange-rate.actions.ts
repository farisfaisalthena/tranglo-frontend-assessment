import { createAction, props } from '@ngrx/store';

import { IExchangeRateData } from '../../interfaces';

export const RefreshExchangeRate = createAction('[Exchange Rates] Refresh Exchange Rates');

export const LoadExchangeRate = createAction(
  '[Exchange Rates] Load Exchange Rates',
  props<{ base_currency: string; force: boolean }>()
);

export const LoadExchangeRateSuccess = createAction(
  '[Exchange Rates] Load Exchange Rates Success',
  props<{
    base_currency: string;
    last_updated: Date;
    last_refresh: Date;
    data: IExchangeRateData[];
  }>()
);

export const LoadExchangeRateFailure = createAction(
  '[Exchange Rates] Load Exchange Rates Failure',
  props<{ error: string | null }>()
);
