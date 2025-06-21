import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { NgIcon } from '@ng-icons/core';

import {
  DefaultSelectedCurrencies,
  PopularCurrencies
} from '../../constants';

@Component({
  selector: 'app-historical-trends',
  imports: [
    NgIcon,
    NgClass
  ],
  templateUrl: './historical-trends.component.html',
  styleUrl: './historical-trends.component.scss'
})
export class HistoricalTrendsComponent {

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
  selectedHistory = this.historyOpts[0].value;
  selectedCurrencies = DefaultSelectedCurrencies;
  popularCurrencies = PopularCurrencies;

  getRandomColor(index: number): string {
    const colors: string[] = ['bg-yellow-500', 'bg-purple-500', 'bg-blue-500'];

    return colors[index];
  };
};
