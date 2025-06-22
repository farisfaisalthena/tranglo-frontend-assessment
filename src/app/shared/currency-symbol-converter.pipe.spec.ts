import { CurrencySymbolConverterPipe } from './currency-symbol-converter.pipe';

describe('CurrencySymbolConverterPipe', () => {
  it('create an instance', () => {
    const pipe = new CurrencySymbolConverterPipe();
    expect(pipe).toBeTruthy();
  });
});
