export interface IExchangeRates {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: { [currency: string]: number };
};

export interface IFormattedExchangeRates {
  last_updated: Date;
  data: IExchangeRateData[];
};

export interface IExchangeRateData {
  code: string;
  name: string;
  rate: number;
};
