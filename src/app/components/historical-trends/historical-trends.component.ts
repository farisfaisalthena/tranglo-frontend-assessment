import { AsyncPipe, NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  delay,
  map,
  Observable,
  switchMap
} from 'rxjs';

import { NgIcon } from '@ng-icons/core';
import { BaseChartDirective } from 'ng2-charts';
import { Modal } from 'flowbite';
import type { ModalOptions, ModalInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import { Store } from '@ngrx/store';
import { format } from 'date-fns';
import { ChartData, ChartDataset } from 'chart.js';


import { GetCurrencyData, GetCurrencyDetails } from '@src/app/constants';
import { CurrencySelectionModalComponent } from '../';
import { ApiService } from '@src/app/services';
import { SelectBaseCurrency } from '@src/app/stores/configs';
import { THistoricalAggregationType } from '@src/app/types';
import { CurrencyDetailsParserPipe } from '@src/app/shared';
import {
  IChart,
  IHistoricalExchangeRatePayload,
  IHistoricalExchangeRateResponse
} from '@src/app/interfaces';
import { getHistoricalDataChartOption } from './chart-option';

@Component({
  selector: 'app-historical-trends',
  imports: [
    NgIcon,
    NgClass,
    AsyncPipe,
    CurrencyDetailsParserPipe,
    BaseChartDirective,
    CurrencySelectionModalComponent
  ],
  templateUrl: './historical-trends.component.html',
  styleUrl: './historical-trends.component.scss'
})
export class HistoricalTrendsComponent implements OnInit {

  private store = inject(Store);
  private api = inject(ApiService);
  @ViewChild('currencySelectionModalEl', { static: false }) currencySelectionModalElRef!: ElementRef<HTMLInputElement>;
  currencySelectionModal: ModalInterface | null = null;
  chart$!: Observable<IChart>;
  selectedCurrencies: string[] = ['IDR'];
  canAddCurrency: boolean = true;
  historyOpts: { name: string; value: THistoricalAggregationType; icon: string; }[] = [
    {
      name: 'Daily',
      value: 'daily',
      icon: 'heroCalendar'
    },
    {
      name: 'Weekly',
      value: 'weekly',
      icon: 'heroChartBar'
    },
    {
      name: 'Monthly',
      value: 'monthly',
      icon: 'heroArrowTrendingUp'
    }
  ];
  selectedHistory = this.historyOpts[0].value;
  availableCurrencies = this.manageCurrencyList('IDR');

  ngOnInit(): void {
    this.getChartInstance();
  };

  onAggregationTypeChanged(val: THistoricalAggregationType) {
    this.selectedHistory = val;

    this.getChartInstance();
  };

  getChartInstance() {
    this.chart$ = this.store.select(SelectBaseCurrency).pipe(
      // Delay by 1 second so when user make changes to the config it wont spam the API
      delay(1000),
      switchMap(currency => {
        const body: IHistoricalExchangeRatePayload = {
          base_currency: currency,
          currency_codes: this.selectedCurrencies,
          interval: this.selectedHistory
        };

        return this.api.getHistoricalExchangeRate(body).pipe(
          map(res => this.generateChart(res, currency))
        );
      })
    );
  };

  getRandomColor(index: number): string {
    const colors: string[] = ['bg-yellow-500', 'bg-purple-500', 'bg-blue-500'];

    return colors[index];
  };

  openModal() {
    const el = this.currencySelectionModalElRef.nativeElement;
    const modalOptions: ModalOptions = {
      placement: 'center',
      backdrop: 'dynamic',
      backdropClasses: 'backdrop-blur-md fixed inset-0 z-40',
      closable: true
    };

    const instanceOptions: InstanceOptions = {
      id: 'modalEl',
      override: true,
    };

    this.currencySelectionModal = new Modal(el, modalOptions, instanceOptions);

    this.currencySelectionModal.toggle();
  };

  handleSelectionCurrencies(currency: string) {
    this.availableCurrencies = this.manageCurrencyList(currency.toUpperCase());

    const index = this.selectedCurrencies.indexOf(currency);

    if (index > -1) {
      this.selectedCurrencies.splice(index, 1);
    } else {
      this.selectedCurrencies.push(currency);
    };

    this.canAddCurrency = this.selectedCurrencies.length < 3;

    this.getChartInstance();
  };

  dismissModal(data: string | null) {
    if (data !== null) {
      this.handleSelectionCurrencies(data);
    };

    this.currencySelectionModal!.hide();
  };

  manageCurrencyList(selectedCurrency: string | null = null) {
    const defaultCurrencies = [
      'USD',
      'SGD',
      'EUR',
      'GBP',
      'AUD',
      'JPY',
      'CNY',
      'THB',
    ];

    let currentCurrencyList = [...defaultCurrencies];

    if (selectedCurrency) {
      const index = currentCurrencyList.indexOf(selectedCurrency);

      if (index > -1) {
        currentCurrencyList.splice(index, 1);
      };
    };

    const allAvailableCurrencies = GetCurrencyData;

    const filteredDefaultCurrencies = allAvailableCurrencies.filter((currency) =>
      currentCurrencyList.includes(currency.code)
    );

    const otherCurrencies = allAvailableCurrencies.filter(
      (currency) =>
        !defaultCurrencies.includes(currency.code) &&
        currency.code !== selectedCurrency
    );

    return [...filteredDefaultCurrencies, ...otherCurrencies].splice(0, 8);
  };

  generateChart(chartData: IHistoricalExchangeRateResponse, currency: string): IChart {
    const graphTitle = `Exchange Rate Trends: ${this.selectedCurrencies.join(', ')} vs ${currency}`;
    const theme = localStorage.getItem('color-theme')?.toLowerCase() ?? 'light';

    const options = getHistoricalDataChartOption(graphTitle, theme);
    const data = this.formatChartData(chartData);

    return {
      options,
      data
    };
  };

  formatChartData(response: IHistoricalExchangeRateResponse): ChartData {
    const currencies = Object.keys(response);
    // Select random currency since its the same start and end date
    const randomCurrency = response[currencies[0]];
    // Format Label nicely
    const labels: string[] = randomCurrency.map(d => format(d.time, 'dd MMMM'));
    // Prepare Colors for Legends
    const colors = [
      'rgb(245, 158, 11)',
      'rgb(139, 92, 246)',
      'rgb(59, 130, 246)'
    ];
    const backgroundColors = [
      'rgba(245, 158, 11, 0.2)',
      'rgba(139, 92, 246, 0.2)',
      'rgba(59, 130, 246, 0.2)',
    ];

    const datasets: ChartDataset[] = currencies.map((curr, index) => {
      const color = colors[index];
      const bgColor = backgroundColors[index];
      const data = response[curr].map(r => r.rate);
      const label = `${curr} - ${GetCurrencyDetails(curr).name}`;

      return {
        label,
        data,
        backgroundColor: bgColor,
        borderColor: color,
        borderWidth: 2,
        fill: false,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointRadius: 2,
        tension: 0.4,
      };
    });

    console.log(datasets)

    return { labels, datasets };
  };
};
