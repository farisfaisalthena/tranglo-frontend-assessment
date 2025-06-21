import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-exchange-rate',
  imports: [
    NgIcon,
    NgClass
  ],
  templateUrl: './exchange-rate.component.html',
  styleUrl: './exchange-rate.component.scss'
})
export class ExchangeRateComponent { };
