import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon } from '@ng-icons/core';
import { IFuseOptions } from 'fuse.js';

import { FusePipe } from '@src/app/shared';
import { GetCurrencyData } from '@src/app/constants';
import { ICurrencyData } from '@src/app/interfaces';

@Component({
  selector: 'app-currency-selection-modal',
  imports: [
    FormsModule,
    FusePipe,
    NgIcon
  ],
  templateUrl: './currency-selection-modal.component.html',
  styleUrl: './currency-selection-modal.component.scss'
})
export class CurrencySelectionModalComponent {

  currencyData = GetCurrencyData;
  fuseOptions: IFuseOptions<ICurrencyData> = {
    keys: ['name', 'code'],
    findAllMatches: true
  };
  searchTerm: string = '';
  skeleton = new Array(3);
  onModalDismiss = output<{ currencyCode: string | null; }>();

  onSelectData(currencyCode: string) {
    this.dismissModal(currencyCode);
  };

  dismissModal(currencyCode: string | null = null) {
    this.onModalDismiss.emit({ currencyCode });
  };
};
