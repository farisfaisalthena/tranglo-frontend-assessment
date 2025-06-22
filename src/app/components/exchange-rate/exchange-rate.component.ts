import { AsyncPipe, NgClass } from '@angular/common';
import {
  Component,
  inject,
  input,
  OnInit
} from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { NgIcon } from '@ng-icons/core';

import { ApiService, ConfigService } from '../../services';
import { IFormattedExchangeRates } from '../../interfaces';
import { CurrencySymbolConverterPipe } from '../../shared';

@Component({
  selector: 'app-exchange-rate',
  imports: [
    NgIcon,
    NgClass,
    AsyncPipe,
    CurrencySymbolConverterPipe
  ],
  templateUrl: './exchange-rate.component.html',
  styleUrl: './exchange-rate.component.scss'
})
export class ExchangeRateComponent implements OnInit {

  private api = inject(ApiService);
  private config = inject(ConfigService);
  autoRefresh = input<boolean>(true);
  baseCurrency$ = this.config.baseCurrency$;
  exchangeRates$!: Observable<IFormattedExchangeRates>;

  ngOnInit(): void {
    this.doRefresh();
  };

  doRefresh(forceRefresh?: boolean) {
    this.exchangeRates$ = this.config.baseCurrency$.pipe(
      switchMap(currency => this.api.getLatestExchangeRate(currency, forceRefresh))
    );
  };

  setCurrencyAsBase(currency: string) {
    this.config.onCurrencyChange(currency);
  };
};
