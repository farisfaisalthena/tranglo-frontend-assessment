import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { NgIcon } from '@ng-icons/core';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

interface IChart {
  options: ChartOptions,
  data: ChartData
};

import {
  DefaultSelectedCurrencies,
  PopularCurrencies
} from '../../constants';

@Component({
  selector: 'app-historical-trends',
  imports: [
    NgIcon,
    NgClass,
    BaseChartDirective
  ],
  templateUrl: './historical-trends.component.html',
  styleUrl: './historical-trends.component.scss'
})
export class HistoricalTrendsComponent implements OnInit {

  baseCurrency: string = 'MYR';
  historyOpts = [
    {
      name: 'Daily',
      value: 1,
      icon: 'heroCalendar'
    },
    {
      name: 'Weekly',
      value: 7,
      icon: 'heroChartBar'
    },
    {
      name: 'Monthly',
      value: 30,
      icon: 'heroArrowTrendingUp'
    }
  ];
  selectedHistory = this.historyOpts[0].value;
  selectedCurrencies = DefaultSelectedCurrencies;
  popularCurrencies = PopularCurrencies;
  chart: IChart | null = null;

  ngOnInit(): void {
    this.getChartData();
  };

  getChartData() {
    const datasets: ChartDataset[] = [
      {
        backgroundColor: 'rgb(59, 130, 246)20',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        data: [
          0.7707250082755885,
          0.746809570852521,
          0.7705359832445542,
          0.7496920605899939,
          0.7731441431172439,
          0.7113697069124413,
          0.7148220780731916
        ],
        fill: false,
        label: 'GBP - British Pound',
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointRadius: 2,
        tension: 0.4
      },
      {
        backgroundColor: 'rgb(16, 185, 129)20',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        data: [
          150.24794281282263,
          152.51241739615804,
          143.57486362072476,
          150.29538115817329,
          151.15418915276422,
          142.80615244457587,
          140.3912392286584
        ],
        fill: false,
        label: 'JPY - Japanese Yen',
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointRadius: 2,
        tension: 0.4
      }
    ];
    const chartConfigs: IChart = {
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          title: {
            display: true,
            text: `Exchange Rate Trends vs ${this.baseCurrency}`,
            font: {
              size: 16,
              weight: 'bold'
            },
            color: 'rgb(255, 255, 255)'
          },
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
              }
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: function (ctx) {
                const label = ctx.dataset.label || '';
                const value = ctx.parsed.y;

                return `${label}: ${value.toFixed(6)}`;
              },
              title: function (ctx) {
                return new Date(ctx[0].label).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 0,
              font: {
                size: 11,
              }
            }
          },
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(107, 114, 128, 0.1)',
            },
            ticks: {
              // TODO: Fix interface type
              callback: function (value: any) {
                return value.toFixed(4);
              },
              font: {
                size: 11,
              }
            }
          }
        },
        elements: {
          point: {
            hoverRadius: 8,
          }
        },
      },
      data: {
        labels: ['2025-06-15', '2025-06-16', '2025-06-17', '2025-06-18', '2025-06-19', '2025-06-20', '2025-06-21'],
        datasets
      }
    };

    this.chart = chartConfigs;
  };

  getRandomColor(index: number): string {
    const colors: string[] = ['bg-yellow-500', 'bg-purple-500', 'bg-blue-500'];

    return colors[index];
  };
};
