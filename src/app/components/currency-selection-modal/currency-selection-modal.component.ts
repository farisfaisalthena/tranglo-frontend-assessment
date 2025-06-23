import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { NgIcon } from '@ng-icons/core';
import { IFuseOptions } from 'fuse.js';

import { ISupportedCurrencyResponse } from '@src/app/interfaces';
import { ApiService } from '@src/app/services';
import { CurrencySymbolConverterPipe, FusePipe } from '@src/app/shared';

@Component({
  selector: 'app-currency-selection-modal',
  imports: [
    AsyncPipe,
    CurrencySymbolConverterPipe,
    FormsModule,
    FusePipe,
    NgIcon
  ],
  templateUrl: './currency-selection-modal.component.html',
  styleUrl: './currency-selection-modal.component.scss'
})
export class CurrencySelectionModalComponent implements OnInit {

  private api = inject(ApiService);
  currencies$!: Observable<ISupportedCurrencyResponse[]>;
  fuseOptions: IFuseOptions<ISupportedCurrencyResponse> = {
    keys: ['name', 'code'],
    findAllMatches: true
  };
  searchTerm: string = '';
  skeleton = new Array(3);
  onModalDismiss = output<void>();

  ngOnInit(): void {
    this.currencies$ = this.api.getSupportedCurrency();
  };

  dismissModal() {
    this.onModalDismiss.emit();
  };
};
