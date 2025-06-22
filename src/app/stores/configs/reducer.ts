import { createReducer, on } from '@ngrx/store';

import { IConfigState } from '../../interfaces';
import { SetBaseCurrency, ToggleAutoRefresh } from './';

export const initialConfigState: IConfigState = {
  base_currency: 'MYR',  // Defaults to Malaysia Ringgit
  auto_refresh_enabled: true,
};

export const ConfigReducer = createReducer(
  initialConfigState,
  on(SetBaseCurrency, (state, { currency }) => ({ ...state, base_currency: currency.toUpperCase() })),
  on(ToggleAutoRefresh, (state, { enabled }) => ({ ...state, auto_refresh_enabled: enabled }))
);
