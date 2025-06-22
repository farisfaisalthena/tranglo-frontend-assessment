import { Pipe, PipeTransform } from '@angular/core';

import currencyData from '../../../public/currencies.json';
import { ILocalCurrencyData } from '../interfaces';

@Pipe({
  name: 'currencySymbolConverter'
})
export class CurrencySymbolConverterPipe implements PipeTransform {

  transform(currencyCode: string): string {
    const data: { [currency: string]: ILocalCurrencyData } = currencyData;
    // Fallback in case the currency code does not exists in the JSON file
    const currency = data[currencyCode.toUpperCase()]?.symbol ?? currencyCode.toUpperCase();

    return currency;
  };
};
