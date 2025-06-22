import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { Toast } from '@capacitor/toast';

import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private networkStatusSub: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private baseCurrencySub: BehaviorSubject<string> = new BehaviorSubject('MYR');

  async listenNetworkStatus() {
    const status = await Network.getStatus();

    this.networkStatusSub.next(status.connected);

    Network.addListener('networkStatusChange', ({ connected }) => {
      console.log('Network status changed', connected);
      this.networkStatusSub.next(connected);
    });
  };

  async showToastMessage(message: string) {
    await Toast.show({
      text: message,
    });
  };

  onCurrencyChange(value: string) {
    this.baseCurrencySub.next(value);
  };

  get networkStatus$(): Observable<boolean> {
    return this.networkStatusSub.asObservable();
  };

  get baseCurrency$(): Observable<string> {
    return this.baseCurrencySub.asObservable().pipe(
      // Ensure currency always uppercase (e.g MYR)
      map(currency => currency.toUpperCase())
    );
  };
};
