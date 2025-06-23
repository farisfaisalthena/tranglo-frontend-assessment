import currencyData from '../../../public/currencies.json';
import { ICurrencyData } from '../interfaces';

export const GetCurrencyData: ICurrencyData[] = currencyData;

export const GetCurrencyDetails = (code: string) => GetCurrencyData
.find(a => a.code.toLowerCase() === code.toLowerCase()) || GetFallbackCurrency;

// Fallback just in case suddenly we get invalid currency data
const GetFallbackCurrency = GetCurrencyData.find(c => c.code.toLowerCase() === 'myr')!;
