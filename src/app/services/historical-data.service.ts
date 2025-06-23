import { inject, Injectable } from '@angular/core';

import {
  format,
  subDays,
  eachDayOfInterval,
  startOfWeek,
} from 'date-fns';
import { ChartDataset } from 'chart.js';

import { ApiService } from './api.service';
import {
  catchError,
  concatMap,
  defer,
  delay,
  from,
  map,
  Observable,
  of,
  toArray
} from 'rxjs';
import { IChart, IHistoricalData } from '../interfaces';
import { getHistoricalDataChartOption } from '../components/historical-trends/chart-option';
import { THistoricalAggregationType } from '../types';
import { GetCurrencyDetails } from '../constants';

interface IAggregatedDataPoint {
  date: string;
  rates: { [currencyCode: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class HistoricalDataService {

  private api = inject(ApiService);

  getChartData(baseCurrency: string, targetCurrencies: string[], aggregationType: THistoricalAggregationType): Observable<IChart> {
    return this.fetchDailyHistoricalRates(baseCurrency, this.getDaysByAggregation(aggregationType)).pipe(
      map((dailyData) => {
        // Just in case no data is available
        if (dailyData.length === 0) {
          return { options: {}, data: { labels: [], datasets: [] } };
        };

        const aggregatedData = this.aggregateData(
          dailyData,
          targetCurrencies,
          aggregationType
        );

        const graphTitle = `Exchange Rate Trends: ${targetCurrencies.join(', ')} vs ${baseCurrency}`
        const theme = localStorage.getItem('color-theme')?.toLowerCase();
        const options = getHistoricalDataChartOption(graphTitle, theme ?? 'light');
        const labels = aggregatedData.map((dataPoint) => dataPoint.date);

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

        const datasets: ChartDataset[] = targetCurrencies.map((currencyCode, index) => {
          const color = colors[index];
          const bgColor = backgroundColors[index];
          const data = aggregatedData.map(d => d.rates[currencyCode]);
          const label = `${currencyCode} - ${GetCurrencyDetails(currencyCode).name}`

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

        return { options, data: { labels, datasets } };
      })
    );
  };

  private fetchDailyHistoricalRates(baseCurrency: string, daysToFetch: number) {
    const today = new Date();
    const startDate = subDays(today, daysToFetch);
    const endDate = subDays(today, 1);

    const datesToFetch = eachDayOfInterval({ start: startDate, end: endDate });
    const fetchObservables: Observable<IHistoricalData | null>[] = [];

    for (const date of datesToFetch) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      fetchObservables.push(
        defer(() => {
          return this.api.getHistoricalData(baseCurrency, year, month, day).pipe(
            // Return null on individual request error to prevent stream completion
            catchError(() => of(null))
          );
        })
      );
    };

    return from(fetchObservables).pipe(
      // Add small delay so we dont get rate limited
      concatMap((obs, index) => obs.pipe(delay(index === 0 ? 0 : 100))),
      toArray(),
      map((results) => results.filter(r => r !== null))
    );
  };

  private aggregateData(
    dailyData: IHistoricalData[],
    targetCurrencies: string[],
    aggregationType: 'daily' | 'weekly' | 'monthly'
  ): IAggregatedDataPoint[] {
    if (dailyData.length === 0) return [];

    dailyData.sort((a, b) =>
      new Date(a.year, a.month - 1, a.day).getTime() -
      new Date(b.year, b.month - 1, b.day).getTime()
    );

    if (aggregationType === 'daily') {
      return dailyData.map((d) => ({
        date: format(new Date(d.year, d.month - 1, d.day), 'yyyy-MM-dd'),
        rates: targetCurrencies.reduce((acc: { [currency: string]: number }, curr) => {
          acc[curr] = d.conversion_rates[curr];
          return acc;
        }, {}),
      }));
    };

    const groupedData: { [key: string]: { [currency: string]: number[] }; } = {};

    dailyData.forEach((d) => {
      const date = new Date(d.year, d.month - 1, d.day);
      let groupKeyDate: Date;

      // Assume if its daily it will return above
      if (aggregationType === 'weekly') {
        groupKeyDate = startOfWeek(date, { weekStartsOn: 1 });
      } else {
        groupKeyDate = new Date(date.getFullYear(), date.getMonth(), 1);
      };

      // Each week will have the start date which is Monday
      const groupKey = format(groupKeyDate, 'yyyy-MM-dd');

      // Ensure the group for this date key exists
      if (!groupedData[groupKey]) {
        groupedData[groupKey] = {};
        targetCurrencies.forEach((curr) => {
          groupedData[groupKey][curr] = [];
        });
      };

      targetCurrencies.forEach((currency) => {
        const rate = d.conversion_rates[currency];

        groupedData[groupKey][currency].push(rate);
      });
    });

    const result: IAggregatedDataPoint[] = [];
    for (const key in groupedData) {
      const avgRates: { [key: string]: number } = {};
      targetCurrencies.forEach((currency) => {
        const rates = groupedData[key][currency];
        if (rates && rates.length > 0) {
          const sum = rates.reduce((a, b) => a + b, 0);
          avgRates[currency] = sum / rates.length;
        } else {
          avgRates[currency] = NaN;
        }
      });

      result.push({ date: key, rates: avgRates });
    };

    return result.sort((a, b) => a.date.localeCompare(b.date));
  };

  private getDaysByAggregation(aggregationType: 'daily' | 'weekly' | 'monthly'): number {
    switch (aggregationType) {
      case 'daily':
        return 7;
      case 'weekly':
        return 28;
      case 'monthly':
        return 90;
      default:
        // Fallback to 1 days only to prevent api spam
        return 1;
    };
  };
};
