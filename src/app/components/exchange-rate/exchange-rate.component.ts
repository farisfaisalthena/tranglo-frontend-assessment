import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import {
  Component,
  inject,
  input,
  OnInit
} from '@angular/core';
import {
  filter,
  Observable,
  tap
} from 'rxjs';

import { NgIcon } from '@ng-icons/core';
import { Store } from '@ngrx/store';

import { IExchangeRateData, IExchangeRateStateResponse } from '../../interfaces';
import { CurrencySymbolConverterPipe } from '../../shared';
import { ResponseMappingService } from '../../services/response-mapping.service';
import { SelectBaseCurrency, SetBaseCurrency } from '../../stores/configs';
import { SelectLastUpdated } from '../../stores/exchange-rate';

@Component({
  selector: 'app-exchange-rate',
  imports: [
    NgIcon,
    NgClass,
    AsyncPipe,
    DatePipe,
    CurrencySymbolConverterPipe
  ],
  templateUrl: './exchange-rate.component.html',
  styleUrl: './exchange-rate.component.scss'
})
export class ExchangeRateComponent implements OnInit {

  private store = inject(Store);
  private responseMapping = inject(ResponseMappingService);
  autoRefresh = input<boolean>(true);
  baseCurrency$ = this.store.select(SelectBaseCurrency);
  exchangeRates$!: Observable<IExchangeRateStateResponse>;
  exchangeRateData: IExchangeRateData[] = [];
  filteredExchangeRateData: IExchangeRateData[] = [];
  lastUpdateAt$!: Observable<Date>;
  lastUpdateAt: Date | null = null;
  filterBy: 'code' | 'name' | 'rate' = 'code';

  ngOnInit(): void {
    this.exchangeRates$ = this.responseMapping.getLatestExchangeRate().pipe(
      tap(response => {
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
    this.store.dispatch(SetBaseCurrency({ currency }));
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
