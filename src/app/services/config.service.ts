import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { Toast } from '@capacitor/toast';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private networkStatusSub: BehaviorSubject<boolean> = new BehaviorSubject(true);

  constructor() { }

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

  get networkStatus$(): Observable<boolean> {
    return this.networkStatusSub.asObservable();
  };
};
