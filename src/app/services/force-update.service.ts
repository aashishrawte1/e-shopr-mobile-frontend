import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { filter, map, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AppUpdatePrompt } from '../models/app-data.model';
import { AppService } from './app.service';
import { StoreService } from './store.service';
const { App } = Plugins;
@Injectable({
  providedIn: 'root',
})
export class ForceUpdateService {
  constructor(
    private appService: AppService,
    private storeService: StoreService
  ) {}

  async checkForNewAppUpdate() {
    if (!(environment.env === 'live' && environment.debug === false)) {
      return;
    }

    // Remote config data
    const appVersionUpdateData = await this.storeService.json.appVersionUpdate
      .pipe(
        filter((upd) => !!upd?.latestVersion),
        take(1)
      )
      .toPromise();

    const { platform, appVersion } = await this.storeService.deviceInfo
      .pipe(
        map((deviceInfo) => ({
          appVersion: deviceInfo.appVersion,
          platform: deviceInfo.platform,
        })),
        take(1)
      )
      .toPromise();

    const latestVersionInStore =
      platform === 'ios'
        ? appVersionUpdateData.latestVersion.appStoreVersion
        : appVersionUpdateData.latestVersion.playStoreVersion;
    if (
      !(
        +latestVersionInStore.toString().split('.').join('') >
        +appVersion.split('.').join('')
      )
    ) {
      return;
    }

    let counter = 0;

    const dialogPromptOptions = {} as AppUpdatePrompt;
    if (appVersionUpdateData.prompt?.header) {
      dialogPromptOptions.header = appVersionUpdateData.prompt.header;
    }
    if (appVersionUpdateData.prompt?.subHeader) {
      dialogPromptOptions.subHeader = appVersionUpdateData.prompt.subHeader;
    }
    if (appVersionUpdateData.prompt?.message) {
      dialogPromptOptions.message = appVersionUpdateData.prompt.message;
    }

    await this.appService.showAlert({
      ...dialogPromptOptions,
      backdropDismiss: false,
      buttons: [
        {
          text: appVersionUpdateData.prompt.buttons[counter++],
          handler: async () =>
            this.redirectUserToPlatformStore({
              androidStoreUrl: appVersionUpdateData.links.android,
              iosStoreUrl: appVersionUpdateData.links.ios,
            }),
        },
      ],
    });
  }

  async redirectUserToPlatformStore({
    iosStoreUrl,
    androidStoreUrl,
  }: {
    iosStoreUrl: string;
    androidStoreUrl: string;
  }) {
    const currentPlatform = this.storeService.deviceInfo.getValue().platform;

    await App.openUrl({
      url:
        currentPlatform === 'ios'
          ? iosStoreUrl
          : currentPlatform === 'android'
          ? androidStoreUrl
          : iosStoreUrl,
    });
  }
}
