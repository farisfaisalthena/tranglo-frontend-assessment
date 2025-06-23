export interface ICurrency {
  code: string;
  currency_name: string;
  country: string;
};

export interface ILocalCurrencyData {
  symbol: string;
  name: string;
  symbol_native: string;
  decimal_digits: number;
  rounding: number;
  code: string;
  name_plural: string;
};

export interface ICurrencyData {
  code: string;
  name: string;
  symbol: string | null;
};
