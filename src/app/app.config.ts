import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { provideIcons } from '@ng-icons/core';
import {
  heroWifiSolid,
  heroMoonSolid,
  heroSunSolid,
  heroGlobeAmericasSolid,
  heroArrowTrendingUpSolid,
  heroBanknotesSolid,
  heroClockSolid,
  heroArrowPathSolid,
  heroPlusSolid,
  heroChevronDownSolid,
  heroArrowsRightLeftSolid
} from '@ng-icons/heroicons/solid';
import {
  heroArrowTrendingUp,
  heroBanknotes,
  heroCalculator,
  heroArrowTrendingDown,
  heroCalendar,
  heroChartBar,
  heroPlus,
  heroXMark,
  heroArrowsUpDown,
  heroMagnifyingGlass
} from '@ng-icons/heroicons/outline';
import {
  provideCharts,
  withDefaultRegisterables
} from 'ng2-charts';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

import { routes } from './app.routes';
import {
  ExchangeRateEffects,
  GetLatestExchangeRateReducer
} from './stores/exchange-rate';
import { ConfigReducer } from './stores/configs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideIcons({
      heroWifiSolid,
      heroMoonSolid,
      heroSunSolid,
      heroGlobeAmericasSolid,
      heroArrowTrendingUpSolid,
      heroBanknotesSolid,
      heroClockSolid,
      heroBanknotes,
      heroArrowTrendingUp,
      heroCalculator,
      heroArrowPathSolid,
      heroArrowTrendingDown,
      heroCalendar,
      heroChartBar,
      heroPlus,
      heroXMark,
      heroArrowsUpDown,
      heroPlusSolid,
      heroMagnifyingGlass,
      heroChevronDownSolid,
      heroArrowsRightLeftSolid
    }),
    provideCharts(withDefaultRegisterables()),
    provideStore({
      get_exchange_rate: GetLatestExchangeRateReducer,
      config: ConfigReducer
    }),
    provideEffects([
      ExchangeRateEffects
    ])
  ]
};
