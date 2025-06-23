import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import {
  filter,
  Observable,
  Subscription,
  takeWhile,
  tap,
  timer
} from 'rxjs';

import { NgIcon } from '@ng-icons/core';
import { Store } from '@ngrx/store';

import {
  SummaryCardComponent,
  ExchangeRateComponent,

  HistoricalTrendsComponent,
  CurrencyConverterComponent
} from '@src/app/components';
import {
  GetCurrencyData,
  REFRESH_TIMER_IN_SECONDS
} from '@src/app/constants';
import { TimeAgoPipe } from '@src/app/shared';
import {
  SelectBaseCurrency,
  ToggleAutoRefresh
} from '@src/app/stores/configs';
import {
  SelectLastRefreshed,
  RefreshExchangeRate
} from '@src/app/stores/exchange-rate';

@Component({
  selector: 'app-dashboard',
  imports: [
    NgIcon,
    NgClass,
    AsyncPipe,
    TimeAgoPipe,
    SummaryCardComponent,
    ExchangeRateComponent,
    HistoricalTrendsComponent,
    CurrencyConverterComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  private store = inject(Store);
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
  selectedView: string = this.viewOpts[2].value;
  autoRefresh: boolean = true;
  baseCurrency$ = this.store.select(SelectBaseCurrency);
  lastExchangeRateRefresh$!: Observable<Date>;
  lastExchangeRateRefresh: Date | null = null;
  totalCurrencies = GetCurrencyData.length.toString();
  // Refresh Timer Variables
  timerSubscription: Subscription | null = null;
  timerDurationLeft = REFRESH_TIMER_IN_SECONDS;
  timerText: string = '01:00';

  ngOnInit(): void {
    this.lastExchangeRateRefresh$ = this.store.select(SelectLastRefreshed).pipe(
      filter(val => val !== null),
      tap(val => this.lastExchangeRateRefresh = val)
    );

    this.startTimer();
  };

  startTimer() {
    // Do nothing if timer is already running
    if (this.timerSubscription && !this.timerSubscription.closed) return;
    // Ensure previous timer is stopped if any (though takeWhile should handle it for resets)
    this.stopTimer();

    this.timerSubscription = timer(0, 1000).pipe(takeWhile(() => this.timerDurationLeft >= 0))
      .subscribe(() => {
        this.updateTimerDisplay();

        this.timerDurationLeft === 0 ? REFRESH_TIMER_IN_SECONDS : this.timerDurationLeft--;
      });
  };

  updateTimerDisplay() {
    const minutes = Math.floor(this.timerDurationLeft / 60);
    const seconds = this.timerDurationLeft % 60;

    this.timerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  };

  toggleAutoRefresh() {
    this.autoRefresh = !this.autoRefresh;

    if (this.autoRefresh) {
      this.startTimer();
    } else {
      this.stopTimer();
    };

    this.store.dispatch(ToggleAutoRefresh({ enabled: this.autoRefresh }));
  };

  manualRefresh() {
    this.store.dispatch(RefreshExchangeRate());
  };

  ngOnDestroy(): void {
    this.stopTimer();
  };
};
