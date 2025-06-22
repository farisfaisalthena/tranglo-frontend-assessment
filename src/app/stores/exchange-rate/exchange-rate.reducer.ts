import { createReducer, on } from '@ngrx/store';

import { IExchangeRateState } from '../../interfaces';
import {
  LoadExchangeRate,
  LoadExchangeRateFailure,
  LoadExchangeRateSuccess
} from './exchange-rate.actions';


const initialExchangeRateState: IExchangeRateState = {
  base_currency: 'MYR', // Defaults to Malaysia Ringgit
  data: [],
  last_updated: null,
  last_refresh: null,
  loading: false,
  error: null,
};

export const GetLatestExchangeRateReducer = createReducer(
  initialExchangeRateState,
  on(LoadExchangeRate, (state) => ({ ...state, loading: true, error: null })),
  on(LoadExchangeRateSuccess, (state, { base_currency, data, last_updated, last_refresh }) => ({
    ...state,
    base_currency,
    data,
    last_updated,
    last_refresh,
    loading: false,
    error: null
  })),
  on(LoadExchangeRateFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
