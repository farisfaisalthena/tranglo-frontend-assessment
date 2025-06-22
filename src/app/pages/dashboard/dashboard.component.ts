import { Component, inject } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';

import { NgIcon } from '@ng-icons/core';

import {
  ExchangeRateComponent,
  HistoricalTrendsComponent,
  SummaryCardComponent
} from '../../components';
import { ApiService, ConfigService } from '../../services';
import { TimeAgoPipe } from '../../shared';

@Component({
  selector: 'app-dashboard',
  imports: [
    NgIcon,
    NgClass,
    AsyncPipe,
    TimeAgoPipe,
    SummaryCardComponent,
    ExchangeRateComponent,
    HistoricalTrendsComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private config = inject(ConfigService);
  viewOpts = [
    {
      name: 'Exchange Rates',
      value: 'rates',
      icon: 'heroBanknotes'
    },
    {
      name: 'History Trends',
      value: 'trends',
      icon: 'heroArrowTrendingUp'
    },
    {
      name: 'Currency Converter',
      value: 'converter',
      icon: 'heroCalculator'
    }
  ];
  selectedView: string = this.viewOpts[0].value;
  autoRefresh: boolean = true;
  private api = inject(ApiService);
  baseCurrency$ = this.config.baseCurrency$;

  testDate = new Date('Sun Jun 22 2025 12:44:03 GMT+0800')

  baseCurrencyOpts = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' }
  ];

  constructor() {
    this.api.getLatestExchangeRate('myr').subscribe(r => console.log(r));
  };
};
