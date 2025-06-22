import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IExchangeRateState } from '../../interfaces';

export const SelectExchangeRateState = createFeatureSelector<IExchangeRateState>('get_exchange_rate');

export const SelectExchangeRate = createSelector(SelectExchangeRateState, (state) => state.data);
export const SelectExchangeRateLoading = createSelector(SelectExchangeRateState, (state) => state.loading);
export const SelectExchangeRateError = createSelector(SelectExchangeRateState, (state) => state.error);
export const SelectLastUpdated = createSelector(SelectExchangeRateState, (state) => state.last_updated);
export const SelectLastRefreshed = createSelector(SelectExchangeRateState, (state) => state.last_refresh);
