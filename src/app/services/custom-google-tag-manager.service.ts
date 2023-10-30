import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { StoreService } from './store.service';
@Injectable({
  providedIn: 'root',
})
export class CustomGoogleTagManagerService {
  private browserGlobals = {
    windowRef: (): any => {
      return window;
    },
    documentRef: (): any => {
      return document;
    },
  };
  constructor(private storeService: StoreService) {}
  recordEvent(data: any) {
    if (environment.env === 'live') {
      const user = this.storeService.loggedInUser.value;
      this.pushOnDataLayer({ ...data, country: user?.country || 'singapore' });
    }
  }

  private getDataLayer(): any[] {
    const window = this.browserGlobals.windowRef();
    window.dataLayer = window.dataLayer || [];
    return window.dataLayer;
  }

  private pushOnDataLayer(obj: any): void {
    const dataLayer = this.getDataLayer();
    console.log(obj);
    dataLayer.push(obj);
  }
}
