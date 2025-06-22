export interface ISupportedCurrency {
  result: string;
  documentation: string;
  terms_of_use: string;
  supported_codes: string[][];
};

export interface ISupportedCurrencyResponse {
  code: string;
  name: string;
};
