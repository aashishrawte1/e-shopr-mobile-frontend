import { Injectable } from '@angular/core';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class AppShareService {
  constructor(private storeService: StoreService) {}

  init() {}
  async getAppShareLink() {
    const deviceInfo = this.storeService.deviceInfo.getValue();
    return this.storeService.json.appVersionUpdate.getValue().links[
      deviceInfo.platform
    ];
  }
}
