import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import {
  Component,
  inject,
  input,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  filter,
  Observable,
  tap
} from 'rxjs';

import { NgIcon } from '@ng-icons/core';
import { Store } from '@ngrx/store';
import { IFuseOptions } from 'fuse.js';

import {
  IExchangeRateStateResponse,
  IExchangeRateData
} from '@src/app/interfaces';
import { ResponseMappingService } from '@src/app/services/response-mapping.service';
import {
  FusePipe,
  CurrencyDetailsParserPipe
} from '@src/app/shared';
import {
  SelectBaseCurrency,
  SetBaseCurrency
} from '@src/app/stores/configs';
import { SelectLastUpdated } from '@src/app/stores/exchange-rate';
import { ConfigService } from '@src/app/services';
import { GetCurrencyDetails } from '@src/app/constants';

@Component({
  selector: 'app-exchange-rate',
  imports: [
    NgIcon,
    NgClass,
    AsyncPipe,
    DatePipe,
    FusePipe,
    FormsModule,
    CurrencyDetailsParserPipe
  ],
  templateUrl: './exchange-rate.component.html',
  styleUrl: './exchange-rate.component.scss'
})
export class ExchangeRateComponent implements OnInit {

  private store = inject(Store);
  private responseMapping = inject(ResponseMappingService);
  private config = inject(ConfigService)
  autoRefresh = input<boolean>(true);
  baseCurrency$ = this.store.select(SelectBaseCurrency);
  exchangeRates$!: Observable<IExchangeRateStateResponse>;
  isLoading: boolean = false;
  exchangeRateData: IExchangeRateData[] = [];
  filteredExchangeRateData: IExchangeRateData[] = [];
  lastUpdateAt$!: Observable<Date>;
  lastUpdateAt: Date | null = null;
  filterBy: 'code' | 'name' | 'rate' = 'code';
  fuseOptions: IFuseOptions<IExchangeRateData> = {
    keys: ['name', 'code'],
    findAllMatches: true
  };
  searchTerm: string = '';

  ngOnInit(): void {
    this.exchangeRates$ = this.responseMapping.getLatestExchangeRate().pipe(
      tap(response => {
        this.isLoading = response.loading;

        if (response.data !== null) {
          this.exchangeRateData = response.data;
          this.onSortData(this.filterBy);
        };
      })
    );

    this.lastUpdateAt$ = this.store.select(SelectLastUpdated).pipe(
      filter(val => val !== null),
      tap(val => this.lastUpdateAt = val)
    );
  };

  onSortData(filterBy: 'code' | 'name' | 'rate') {
    this.filterBy = filterBy;
    this.filteredExchangeRateData = this.sortRates(this.exchangeRateData, this.filterBy);
  };

  setCurrencyAsBase(currency: string) {
    const currencyDetails = GetCurrencyDetails(currency);
    const message: string = `Updated Base Currency to ${currency} - ${currencyDetails.name}`;

    this.store.dispatch(SetBaseCurrency({ currency }));
    this.config.showToastMessage(message);
  };

  sortRates<K extends keyof IExchangeRateData>(items: IExchangeRateData[], key: K): IExchangeRateData[] {
    return [...items].sort((a, b) => {
      const vA = a[key];
      const vB = b[key];

      let cmp: number;
      if (typeof vA === 'number' && typeof vB === 'number') {
        // numeric
        cmp = vA - vB;
      } else {
        // string (or fallback)
        cmp = String(vA).localeCompare(String(vB));
      }

      return 1 * cmp;
    });
  }
};
