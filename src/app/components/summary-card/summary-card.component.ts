import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-summary-card',
  imports: [
    NgIcon,
    NgClass
  ],
  templateUrl: './summary-card.component.html',
  styleUrl: './summary-card.component.scss'
})
export class SummaryCardComponent {

  textTitle = input.required<string>();
  textDescription = input.required<string>();
  cardBackgroundColor = input.required<string>();
  iconName = input.required<string>();
  iconBackgroundColor = input.required<string>();
  iconTextColor = input.required<string>();

};
