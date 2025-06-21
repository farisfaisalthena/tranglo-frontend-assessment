import { Injectable } from '@angular/core';

import { Network } from '@capacitor/network';
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

  get networkStatus$(): Observable<boolean> {
    return this.networkStatusSub.asObservable();
  };
};
