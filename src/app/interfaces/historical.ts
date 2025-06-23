import { ChartOptions, ChartData } from 'chart.js';

export interface IHistoricalData {
  result: string;
  documentation: string;
  terms_of_use: string;
  year: number;
  month: number;
  day: number;
  base_code: string;
  conversion_rates: { [currency: string]: number };
};

export interface IChart {
  options: ChartOptions;
  data: ChartData;
};
