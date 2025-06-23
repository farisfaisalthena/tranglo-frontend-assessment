import { DecimalPipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-currency-converter',
  imports: [
    DecimalPipe,
    NgClass,
    NgIcon
  ],
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.scss'
})
export class CurrencyConverterComponent {

  quickAmountOpts: number[] = [100, 500, 1000, 5000, 10000];
  selectedAmount: number = this.quickAmountOpts[0];

}
