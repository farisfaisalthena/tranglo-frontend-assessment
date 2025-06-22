import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IConfigState } from '../../interfaces';

const SelectConfigState = createFeatureSelector<IConfigState>('config');

export const SelectBaseCurrency = createSelector(
  SelectConfigState,
  (state) => state.base_currency
);

export const SelectAutoRefreshEnabled = createSelector(
  SelectConfigState,
  (state) => state.auto_refresh_enabled
);
