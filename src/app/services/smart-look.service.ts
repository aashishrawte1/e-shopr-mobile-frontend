import { Injectable } from '@angular/core';
import {
  Smartlook,
  SmartlookCustomEvent,
  SmartlookSetupConfigBuilder,
  SmartlookUserIdentifier,
} from '@ionic-native/smartlook/ngx';
import { environment } from '../../environments/environment';
import { StoreService } from './store.service';
@Injectable({
  providedIn: 'root',
})
export class SmartLookService {
  constructor(
    private smartLookService: Smartlook,
    private storeService: StoreService
  ) {}

  async init() {
    if (!(environment.env === 'live' && environment.debug === false)) {
      return;
    }
    const builder = new SmartlookSetupConfigBuilder(
      environment.smartLookApiKey
    ).startNewSessionAndUser(true);

    this.storeService.loggedInUser.subscribe((user) => {
      if (!!(user && user.uid)) {
        const identifiableProps: {
          name: string;
          email: string;
          deviceUUID: string;
        } = {
          email: user.email,
          name: user.fullName,
          deviceUUID: this.storeService.deviceInfo.value.uuid,
        };
        this.smartLookService.setUserIdentifier(
          new SmartlookUserIdentifier(user.uid, identifiableProps)
        );
      }
    });

    this.smartLookService.setupAndStartRecording(builder.build());
  }

  logEvent({
    eventName,
    data,
  }: {
    eventName: 'checkout' | 'add_to_cart';
    data: any;
  }) {
    this.smartLookService.trackCustomEvent(
      new SmartlookCustomEvent(eventName, data)
    );
  }
}
