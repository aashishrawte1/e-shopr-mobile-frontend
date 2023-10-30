import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { default as applicationConfig } from './../application.json';
import { StoreService } from './store.service';
const { Device } = Plugins;
interface VersionInfo {
  websiteVersion: string;
}
@Injectable({
  providedIn: 'root',
})
export class DeviceInfoService {
  constructor(private storeService: StoreService) {}
  async init() {
    const {
      appBuild,
      osVersion,
      model,
      operatingSystem,
      uuid,
      appVersion,
    } = await Device.getInfo();

    const websiteVersion = (applicationConfig as VersionInfo).websiteVersion;

    this.storeService.deviceInfo.next({
      websiteVersion,
      appBuild,
      osVersion,
      model,
      appVersion,
      platform: operatingSystem === 'mac' ? 'ios' : (operatingSystem as any),
      uuid,
    });

    return true;
  }
}
