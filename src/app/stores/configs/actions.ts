import { createAction, props } from '@ngrx/store';

export const SetBaseCurrency = createAction(
  '[Config] Set Base Currency',
  props<{ currency: string }>()
);

export const ToggleAutoRefresh = createAction(
  '[Config] Toggle Auto Refresh',
  props<{ enabled: boolean }>()
);
