import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideIcons } from '@ng-icons/core';
import {
  heroWifiSolid,
  heroMoonSolid,
  heroSunSolid
 } from '@ng-icons/heroicons/solid';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideIcons({
      heroWifiSolid,
      heroMoonSolid,
      heroSunSolid
    })
  ]
};
