import { AsyncPipe, NgClass } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';

import { NgIcon } from '@ng-icons/core';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Modal } from 'flowbite';
import type { ModalOptions, ModalInterface } from 'flowbite';
import type { InstanceOptions } from 'flowbite';

interface IChart {
  options: ChartOptions,
  data: ChartData
};

import {
  DefaultSelectedCurrencies,
  PopularCurrencies
} from '../../constants';
import { CurrencySelectionModalComponent } from '../';
import { HistoricalDataService } from '@src/app/services';
import { Observable, switchMap, tap } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { SelectBaseCurrency } from '@src/app/stores/configs';

@Component({
  selector: 'app-historical-trends',
  imports: [
    NgIcon,
    NgClass,
    AsyncPipe,
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
  // baseCurrency$!: Observable<string>;
  chart$!: Observable<IChart>;
  // baseCurrency: string = '';



  historyOpts = [
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
  selectedHistory = this.historyOpts[0].value as any;
  selectedCurrencies = DefaultSelectedCurrencies;
  popularCurrencies = PopularCurrencies;
  chart: IChart | null = null;

  ngOnInit(): void {
    // this.baseCurrency$ = this.store.select(SelectBaseCurrency).pipe(
    //   tap(currency => this.baseCurrency = currency)
    // );

    this.chart$ = this.store.select(SelectBaseCurrency).pipe(
      switchMap(currency => this.historicalData.getChartData(currency, ['EUR', 'GBP', 'USD'], this.selectedHistory))
    );


    // this.historicalData.getChartData(this.baseCurrency, ['EUR', 'GBP', 'USD'], this.selectedHistory).subscribe(r => this.getChartData(r));
  };

  getChartData(data: { labels: string[]; datasets: ChartDataset[] }) {
    // const datasets: ChartDataset[] = [
    //   {
    //     backgroundColor: 'rgb(59, 130, 246)20',
    //     borderColor: 'rgb(59, 130, 246)',
    //     borderWidth: 2,
    //     data: [
    //       0.7707250082755885,
    //       0.746809570852521,
    //       0.7705359832445542,
    //       0.7496920605899939,
    //       0.7731441431172439,
    //       0.7113697069124413,
    //       0.7148220780731916
    //     ],
    //     fill: false,
    //     label: 'GBP - British Pound',
    //     pointBackgroundColor: 'rgb(59, 130, 246)',
    //     pointBorderColor: '#fff',
    //     pointBorderWidth: 2,
    //     pointHoverRadius: 6,
    //     pointRadius: 2,
    //     tension: 0.4
    //   },
    //   {
    //     backgroundColor: 'rgb(16, 185, 129)20',
    //     borderColor: 'rgb(16, 185, 129)',
    //     borderWidth: 2,
    //     data: [
    //       150.24794281282263,
    //       152.51241739615804,
    //       143.57486362072476,
    //       150.29538115817329,
    //       151.15418915276422,
    //       142.80615244457587,
    //       140.3912392286584
    //     ],
    //     fill: false,
    //     label: 'JPY - Japanese Yen',
    //     pointBackgroundColor: 'rgb(16, 185, 129)',
    //     pointBorderColor: '#fff',
    //     pointBorderWidth: 2,
    //     pointHoverRadius: 6,
    //     pointRadius: 2,
    //     tension: 0.4
    //   }
    // ];
    // const chartConfigs: IChart = {
    //   options: {
    //     responsive: true,
    //     maintainAspectRatio: true,
    //     interaction: {
    //       mode: 'index',
    //       intersect: false
    //     },
    //     plugins: {
    //       title: {
    //         display: true,
    //         text: `Exchange Rate Trends vs ${this.baseCurrency}`,
    //         font: {
    //           size: 16,
    //           weight: 'bold'
    //         },
    //         color: 'rgb(255, 255, 255)'
    //       },
    //       legend: {
    //         position: 'top',
    //         labels: {
    //           usePointStyle: true,
    //           padding: 20,
    //           font: {
    //             size: 12,
    //           }
    //         },
    //       },
    //       tooltip: {
    //         backgroundColor: 'rgba(0, 0, 0, 0.8)',
    //         titleColor: '#fff',
    //         bodyColor: '#fff',
    //         borderColor: 'rgba(255, 255, 255, 0.2)',
    //         borderWidth: 1,
    //         cornerRadius: 8,
    //         displayColors: true,
    //         callbacks: {
    //           label: function (ctx) {
    //             const label = ctx.dataset.label || '';
    //             const value = ctx.parsed.y;

    //             return `${label}: ${value.toFixed(6)}`;
    //           },
    //           title: function (ctx) {
    //             return new Date(ctx[0].label).toLocaleDateString('en-US', {
    //               year: 'numeric',
    //               month: 'short',
    //               day: 'numeric',
    //             });
    //           }
    //         }
    //       }
    //     },
    //     scales: {
    //       x: {
    //         grid: {
    //           display: false,
    //         },
    //         ticks: {
    //           maxRotation: 0,
    //           font: {
    //             size: 11,
    //           }
    //         }
    //       },
    //       y: {
    //         beginAtZero: false,
    //         grid: {
    //           color: 'rgba(107, 114, 128, 0.1)',
    //         },
    //         ticks: {
    //           // TODO: Fix interface type
    //           callback: function (value: any) {
    //             return value.toFixed(4);
    //           },
    //           font: {
    //             size: 11,
    //           }
    //         }
    //       }
    //     },
    //     elements: {
    //       point: {
    //         hoverRadius: 8,
    //       }
    //     },
    //   },
    //   data: {
    //     ...data
    //   }
    // };

    // this.chart = chartConfigs;
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
      backdropClasses:
        'backdrop-blur-md fixed inset-0 z-40',
      closable: true,
      onHide: () => {
        console.log('modal is hidden');
      },
      onShow: () => {
        console.log('modal is shown');
      },
      onToggle: () => {
        // s.toggle()
        console.log('modal has been toggled');
      },
    };

    // instance options object
    const instanceOptions: InstanceOptions = {
      id: 'modalEl',
      override: true,
    };

    this.currencySelectionModal = new Modal(el, modalOptions, instanceOptions);

    this.currencySelectionModal.toggle();
  };

  dismissModal() {
    this.currencySelectionModal!.hide();
  };
};
