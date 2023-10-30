import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { CustomGoogleTagManagerService } from './services/custom-google-tag-manager.service';
import { first } from 'rxjs/operators';
import { PageRoutes } from './constants';
import { IRangeTracker } from './models';
import { gtmEventNames } from './models/gtm-event.model';
import { AppShareService } from './services/app-share.service';
import { AuthService } from './services/auth.service';
import { ShoppingCartService } from './services/shopping-cart.service';
import { StaticAssetService } from './services/static-asset.service';
import { StoreService } from './services/store.service';
import PageObserverComponent from './utils/component-observer.util';
import { Router } from '@angular/router';

import { NgZone } from '@angular/core';
import { URLOpenListenerEvent } from '@capacitor/app';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { App, Share } = Plugins;
@Component({
  selector: 'user-portal-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class StarterPageComponent
  extends PageObserverComponent
  implements OnInit {
  cartItemCount = 0;
  itemRange: IRangeTracker = {
    previous: null,
    current: {
      start: 1,
      end: 100,
    },
  };
  newMessageCount: number;
  deviceUUID: string;
  currentAppVersion: string;
  constructor(
    private navController: NavController,
    private authService: AuthService,
    public assetService: StaticAssetService,
    private shoppingCartService: ShoppingCartService,
    public storeService: StoreService,
    private appShareService: AppShareService,
    private gtmService: CustomGoogleTagManagerService,
    private router: Router,
    private zone: NgZone
  ) {
    super();
    this.initializeApp();
  }

  initializeApp() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        const slug = event.url.split('.com').pop();
        if (slug) {
          this.router.navigateByUrl(slug);
        }
      });
    });
  }

  async ngOnInit() {
    this.storeService.deviceInfo
      .pipe(first((deviceInfo) => !!deviceInfo))
      .subscribe((deviceInfo) => {
        this.deviceUUID = deviceInfo.uuid;
        this.currentAppVersion = deviceInfo.websiteVersion;
      });

    this.observe(this.storeService.shoppingCart, async (_) => {
      this.cartItemCount = await this.shoppingCartService.getTotalItemCountInCart();
    });

    this.observe(
      this.storeService.greenConciergeChatNewMessageCounterStream,
      (val) => {
        this.newMessageCount = val || 0;
      }
    );
  }

  async logout() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.menuItemClick,
        menuItem: 'logout',
      });
    } catch (error) {}
    await this.authService.logout();
    this.navController.navigateRoot(PageRoutes.fullUrls.login, {
      replaceUrl: true,
    });
  }

  async shareApp() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.menuItemClick,
        menuItem: 'shareApp',
      });
    } catch (error) {}
    const appDownloadLink = await this.appShareService.getAppShareLink();
    let appShareData = this.storeService.json.pageConfig.getValue()
      .appShareText;

    appShareData = JSON.parse(
      JSON.stringify(appShareData).replace(
        /{{appDownloadLink}}/g,
        appDownloadLink
      )
    );
    Share.share(appShareData);
  }

  gotoPage(page: string, menuItemText: string) {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.menuItemClick,
        menuItem: menuItemText,
      });
    } catch (error) {}
    this.navController.navigateForward(page);
  }

  async goToApplicationStore() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.menuItemClick,
        menuItem: 'share-app',
      });
    } catch (error) {}
    const appVersionUpdateData = this.storeService.json.appVersionUpdate.value;
    const currentPlatform = this.storeService.deviceInfo.value.platform;
    await App.openUrl({
      url:
        currentPlatform === 'ios'
          ? appVersionUpdateData.links.ios
          : appVersionUpdateData.links.android,
    });
  }

  onChatClick() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.menuItemClick,
        menuItem: 'green concierge',
      });
    } catch (error) {}
    this.navController.navigateForward(PageRoutes.fullUrls.chat);
  }

  onProfilePictureClick() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.menuItemUserProfilePictureClick,
        menuItem: 'green concierge',
      });
    } catch (error) {}
  }
}
