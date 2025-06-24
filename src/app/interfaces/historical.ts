import { ChartOptions, ChartData } from 'chart.js';

import { THistoricalAggregationType } from '../types';

export interface IHistoricalExchangeRatePayload {
  base_currency: string;
  currency_codes: string[];
  interval: THistoricalAggregationType;
};

export interface IHistoricalExchangeRateResponse {
  [currency: string]: ICurrencyRateData[];
};

export interface ICurrencyRateData {
  rate: number;
  source: string;
  target: string;
  time: Date;
};

export interface IChart {
  options: ChartOptions;
  data: ChartData;
};
