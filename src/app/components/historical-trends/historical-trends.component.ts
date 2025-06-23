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
  Observable,
  switchMap
} from 'rxjs';

import { NgIcon } from '@ng-icons/core';
import { BaseChartDirective } from 'ng2-charts';
import { Modal } from 'flowbite';
import type { ModalOptions, ModalInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';
import { Store } from '@ngrx/store';


import { GetCurrencyData } from '@src/app/constants';
import { CurrencySelectionModalComponent } from '../';
import { HistoricalDataService } from '@src/app/services';
import { SelectBaseCurrency } from '@src/app/stores/configs';
import { THistoricalAggregationType } from '@src/app/types';
import { CurrencyDetailsParserPipe } from '@src/app/shared';
import { IChart } from '@src/app/interfaces';

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

  private historicalData = inject(HistoricalDataService);
  private store = inject(Store);
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
      switchMap(currency => this.historicalData.getChartData(currency, this.selectedCurrencies, this.selectedHistory))
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
};
