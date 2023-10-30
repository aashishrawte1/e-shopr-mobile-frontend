import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import {
  IAppConfigCountryListConfig,
  ISearchFilterSection,
  PageConfig,
} from '../models/app-data.model';
import { LocalJsonDataService } from './local-json-data.service';
import { StoreService } from './store.service';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  constructor(
    public modalController: ModalController,
    private storeService: StoreService,
    private localJsonDataService: LocalJsonDataService
  ) {}

  get constants() {
    return this.storeService.json.pageConfig.value.constants;
  }

  async getJsonData() {
    const websiteVersion = this.storeService.deviceInfo.value.websiteVersion;
    const hash = +new Date();
    // Reason we maintain a version is when we push an update to users, existing ones wont be affected.
    // https://eshopr1in.blr1.cdn.digitaloceanspaces.com/cdn/user-portal/app-data-json/uat/5.4/app-updates.json
    const fileLocation = `https://eshopr1in.blr1.cdn.digitaloceanspaces.com/cdn/user-portal/app-data-json/${
      environment.env === 'local' || environment.env === 'uat' ? 'uat' : 'prod'
    }/${websiteVersion}`;

    const localDataConfigArray = [
      {
        key: 'pageConfig',
        localData: this.localJsonDataService.get<PageConfig>('pageConfig'),
      },
      {
        key: 'productSearchFilterData',
        localData: this.localJsonDataService.get<ISearchFilterSection>(
          'productSearchFilterData'
        ),
      },
      {
        key: 'countryListConfig',
        localData: this.localJsonDataService.get<IAppConfigCountryListConfig>(
          'countryListConfig'
        ),
      },
    ];

    for (const item of localDataConfigArray) {
      this.storeService.json[item.key].next(item.localData);
    }

    const remoteDataConfigArray = [
      {
        key: 'appVersionUpdate',
        remoteUrl: `${fileLocation}/app-updates.json?hash=${hash}`,
      },
      {
        key: 'banners',
        remoteUrl: `${fileLocation}/app-banners.json?hash=${hash}`,
      },
      {
        key: 'homePageFeaturedCategories',
        remoteUrl: `${fileLocation}/home-page-featured-categories.json?hash=${hash}`,
      },
      {
        key: 'playgroundData',
        remoteUrl: `${fileLocation}/playground-data.json?hash=${hash}`,
      },
    ];

    const promises = [];
    for (const item of remoteDataConfigArray) {
      promises.push(fetch(item.remoteUrl).then((res) => res.json()));
    }

    const responses = await Promise.all(promises);
    for (const [index, response] of Object.entries(responses)) {
      if (!!!response) {
        console.error('failed to fetch json config from azure');
      }
      this.storeService.json[remoteDataConfigArray[index].key].next(response);
    }
    return true;
  }
}
