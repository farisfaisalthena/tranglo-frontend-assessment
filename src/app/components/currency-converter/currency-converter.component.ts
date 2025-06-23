import { AsyncPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { filter, Observable, take, tap } from 'rxjs';

import { NgIcon } from '@ng-icons/core';
import {
  InstanceOptions,
  Modal,
  ModalInterface,
  ModalOptions
} from 'flowbite';
import { Store } from '@ngrx/store';

import { CurrencySelectionModalComponent } from '../currency-selection-modal/currency-selection-modal.component';
import { SelectBaseCurrency, SetBaseCurrency } from '@src/app/stores/configs';
import { ResponseMappingService } from '@src/app/services';
import { ICurrencyData, IExchangeRateData, IExchangeRateStateResponse } from '@src/app/interfaces';
import { SelectLastUpdated } from '@src/app/stores/exchange-rate';
import { GetCurrencyDetails } from '@src/app/constants';

@Component({
  selector: 'app-currency-converter',
  imports: [
    DecimalPipe,
    NgClass,
    NgIcon,
    AsyncPipe,
    DatePipe,
    FormsModule,
    CurrencySelectionModalComponent,
    ReactiveFormsModule
  ],
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.scss'
})
export class CurrencyConverterComponent implements OnInit {

  private store = inject(Store);
  private responseMapping = inject(ResponseMappingService);
  @ViewChild('currencySelectionModalEl', { static: false }) currencySelectionModalElRef!: ElementRef<HTMLInputElement>;
  exchangeRates$!: Observable<IExchangeRateStateResponse>;
  exchangeRateData: IExchangeRateData[] = [];
  currencySelectionModal: ModalInterface | null = null;
  quickAmountOpts: number[] = [100, 500, 1000, 5000, 10000];
  selectedAmount: number = this.quickAmountOpts[0];
  currencyConverterForm = new FormGroup({
    base_currency: new FormControl('', [Validators.required]),
    base_currency_amount: new FormControl('', [Validators.required]),
    target_currency: new FormControl('USD', [Validators.required]),
    target_currency_amount: new FormControl('0', [Validators.required]),
  });
  isLoading: boolean = false;
  lastUpdated: Date | null = null;
  modalOpenedFor: 'baseCurrency' | 'targetCurrency' | null = null;


  currencyConverterConfig: {
    baseCurrency: string;
    baseCurrencyAmount: number;
    baseCurrencyDetails: ICurrencyData;
    targetCurrency: string;
    targetCurrencyDetails: ICurrencyData;
    targetCurrencyAmount: number;
    targetCurrencyRate: number;
    lastUpdated: Date | null;
  } = {
      baseCurrency: 'MYR',
      baseCurrencyAmount: this.quickAmountOpts[0],
      baseCurrencyDetails: GetCurrencyDetails('MYR'),
      targetCurrency: 'USD',
      targetCurrencyDetails: GetCurrencyDetails('USD'),
      targetCurrencyAmount: 0,
      targetCurrencyRate: 0,
      lastUpdated: null
    };

  ngOnInit(): void {
    this.store.select(SelectBaseCurrency).pipe(
      take(1),
      tap(val => this.currencyConverterConfig.baseCurrency = val)
    ).subscribe();

    this.store.select(SelectLastUpdated).pipe(
      take(1),
      filter(val => val !== null),
      tap(val => this.currencyConverterConfig.lastUpdated = val)
    ).subscribe();

    this.exchangeRates$ = this.responseMapping.getLatestExchangeRate().pipe(
      tap(response => {
        this.isLoading = response.loading;

        if (response.data !== null) {
          const currency = response.data.find(c => c.code === this.currencyConverterConfig.targetCurrency);
          this.currencyConverterConfig.targetCurrencyRate = currency?.rate || 0;

          this.onAmountChange();

          this.exchangeRateData = response.data;
        };
      })
    );
  };

  onQuickAmountChange(val: number) {
    this.selectedAmount = val;
    this.currencyConverterConfig.baseCurrencyAmount = val;

    this.onAmountChange();
  };

  onAmountChange() {
    const amount = +this.currencyConverterConfig.baseCurrencyAmount;

    this.selectedAmount = +amount;

    this.currencyConverterConfig.targetCurrencyAmount = amount * this.currencyConverterConfig.targetCurrencyRate;
  };

  handleCurrencyChange(key: 'baseCurrency' | 'targetCurrency', currency: string) {
    const currencyData = this.exchangeRateData.find(c => c.code === currency);

    this.currencyConverterConfig[key] = currency;
    this.currencyConverterConfig[`${key}Details`] = GetCurrencyDetails(currency);
    this.currencyConverterConfig.targetCurrencyRate = currencyData?.rate || 0;
  };

  openModal(key: 'baseCurrency' | 'targetCurrency') {
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
    this.modalOpenedFor = key;

    this.currencySelectionModal.toggle();
  };

  swapCurrencies() {
    const configObj = this.currencyConverterConfig;

    const oldBaseCurrency = configObj.baseCurrency;

    configObj.baseCurrency = configObj.targetCurrency;
    configObj.baseCurrencyAmount = configObj.targetCurrencyAmount;

    // Need to change Base Currency to call API again
    this.store.dispatch(SetBaseCurrency({ currency: configObj.targetCurrency }));
    const currency = this.exchangeRateData.find(c => c.code === oldBaseCurrency);

    this.currencyConverterConfig.targetCurrencyRate = currency?.rate || 0;
    configObj.targetCurrency = oldBaseCurrency;

    configObj.baseCurrencyDetails = GetCurrencyDetails(configObj.baseCurrency);
    configObj.targetCurrencyDetails = GetCurrencyDetails(configObj.targetCurrency);
  };

  dismissModal(data: string | null) {
    if (data !== null) {
      this.handleCurrencyChange(this.modalOpenedFor as 'baseCurrency' | 'targetCurrency', data);
    };

    this.modalOpenedFor = null;
    this.currencySelectionModal!.hide();
  };

  get baseCurrencyControls(): AbstractControl {
    return this.currencyConverterForm.get('base_currency') as AbstractControl;
  };

  get baseCurrencyAmountControls(): AbstractControl {
    return this.currencyConverterForm.get('base_currency_amount') as AbstractControl;
  };

  get targetCurrencyControls(): AbstractControl {
    return this.currencyConverterForm.get('target_currency') as AbstractControl;
  };
};
