import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
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
  heroArrowPathSolid
} from '@ng-icons/heroicons/solid';
import {
  heroArrowTrendingUp,
  heroBanknotes,
  heroCalculator,
  heroArrowTrendingDown,
  heroCalendar,
  heroChartBar,
  heroPlus,
  heroXMark
} from '@ng-icons/heroicons/outline';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
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
      heroXMark
    })
  ]
};
