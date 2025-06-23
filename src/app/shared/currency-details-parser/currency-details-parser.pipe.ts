import { Pipe, PipeTransform } from '@angular/core';

import { GetCurrencyDetails } from '@src/app/constants';

@Pipe({
  name: 'currencyDetailsParser'
})
export class CurrencyDetailsParserPipe implements PipeTransform {
  /** Pipe to parse currency code and return to desired type */
  transform(currencyCode: string, type: 'symbol' | 'name'): string {
    const data = GetCurrencyDetails(currencyCode);
    // Fallback in case the currency code does not exists in the JSON file
    const currencySymbol = data.symbol ?? currencyCode.toUpperCase();

    return type === 'symbol' ? currencySymbol : data.name;
  };
};
