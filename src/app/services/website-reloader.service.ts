import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PageRoutes } from '../constants';
import { endpoints } from '../constants/endpoints';
import { ILatestSiteDeployment } from '../models';
import { RequestService } from './request.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class WebsiteReloaderService {
  constructor(
    private requestService: RequestService,
    private storeService: StoreService,
    private navController: NavController
  ) {}
  async init() {
    const response = await this.fetchLatestRelease();
    this.storeService.websiteLastReleaseJSDate = this.getDateFromString({
      str: response.result.releaseTime,
    });
  }

  async reloadIfNewDeploymentAvailable() {
    if (!this.storeService.websiteLastReleaseJSDate) {
      return;
    }

    const latestReleaseJsDate = this.getDateFromString({
      str: (await this.fetchLatestRelease()).result.releaseTime,
    });

    if (latestReleaseJsDate > this.storeService.websiteLastReleaseJSDate) {
      await this.reloadApp();
    }
    this.storeService.websiteLastReleaseJSDate = latestReleaseJsDate;
  }

  getDateFromString({ str }: { str: string }) {
    const date = new Date(str);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  }

  async reloadApp() {
    this.navController.navigateRoot(PageRoutes.fullUrls.home).then((_) => {
      window.location.reload();
    });
  }

  private fetchLatestRelease() {
    return this.requestService.send<ILatestSiteDeployment>(
      'GET',
      endpoints.getLatestSiteDeploymentTime
    );
  }
}
