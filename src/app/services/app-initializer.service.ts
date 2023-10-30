import { Injectable } from '@angular/core';
import { Plugins, StatusBarStyle } from '@capacitor/core';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { AnalyticService } from './analytic.service';
import { ApiService } from './api.service';
import { AppConfigService } from './app-config.service';
import { AppEventService } from './app-event.service';
import { AppShareService } from './app-share.service';
import { AppService } from './app.service';
import { ArticleService } from './article.service';
import { AuthService } from './auth.service';
import { ChatService } from './chat.service';
import { CoinService } from './coin.service';
import { ConsoleLoggerService } from './console-logger.service';
import { DeviceInfoService } from './device-info.service';
import { ForceUpdateService } from './force-update.service';
import { ImageLazyLoaderService } from './image-lazy-loader.service';
import { MixedDataGetterService } from './mixed-data.service';
import { ProductFetcherService } from './product-fetcher.service';
import { ProductShareService } from './product-share.service';
import { PushNotificationService } from './push-notification.service';
import { ReferralCodeService } from './referral-code.service';
import { RequestService } from './request.service';
import { RoutingStateService } from './routing-state.service';
import { SentryLoggerService } from './sentry-logger.service';
import { UserSessionService } from './session.service';
import { ShoppingCartService } from './shopping-cart.service';
import { StaticAssetService } from './static-asset.service';
import { StoreService } from './store.service';
import { UserProfileService } from './user-profile.service';
import { WebsiteReloaderService } from './website-reloader.service';
import { SmartLookService } from './smart-look.service';
import { BarteringChatService } from '../pages/bartering/bartering-chat.service';
import { BarteringService } from '../pages/bartering/bartering.service';
import { CustomGoogleTagManagerService } from './custom-google-tag-manager.service';
import { gtmEventNames } from '../models/gtm-event.model';
import { AlgoliaSearchService } from '../services/algolia/algolia-search.service';
import { ZohoService } from './zoho/zoho.service';
// eslint-disable-next-line @typescript-eslint/naming-convention
const { SplashScreen, StatusBar } = Plugins;
@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  constructor(
    private appConfigService: AppConfigService,
    private routingStateService: RoutingStateService,
    private forceUpdateService: ForceUpdateService,
    private coinService: CoinService,
    private imageLazyLoaderService: ImageLazyLoaderService,
    private chatService: ChatService,
    private sentryLoggerService: SentryLoggerService,
    private analyticsService: AnalyticService,
    private pushNotificationService: PushNotificationService,
    private storeService: StoreService,
    private appService: AppService,
    private productService: ProductFetcherService,
    private articleService: ArticleService,
    private appShareService: AppShareService,
    private consoleLoggerService: ConsoleLoggerService,
    private appEventService: AppEventService,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService,
    private assetService: StaticAssetService,
    private requestService: RequestService,
    private apiService: ApiService,
    private mixedPageService: MixedDataGetterService,
    private deviceInfoService: DeviceInfoService,
    private userSessionService: UserSessionService,
    private referralCodeService: ReferralCodeService,
    private shareProductService: ProductShareService,
    private userProfileService: UserProfileService,
    private websiteReloaderService: WebsiteReloaderService,
    private smartLookService: SmartLookService,
    private barteringService: BarteringService,
    private barteringChatService: BarteringChatService,
    private gtmService: CustomGoogleTagManagerService,
    private algoliaSearchService: AlgoliaSearchService,
    private zohoService: ZohoService
  ) {}

  async init() {
    this.appEventService.init();
    // personalization
    this.appEventService.onAppReady().subscribe(async (_) => {
      this.gtmService.recordEvent({
        event: gtmEventNames.appReady,
      });
      // App Setup
      await this.storeService.init();
      await this.deviceInfoService.init();
      await this.getFreshData();
      // Must initialize dependent services after this line
      this.algoliaSearchService.initialize();
      this.zohoService.init();
      await this.smartLookService.init();

      this.userProfileService.init();
      this.authService.init();
      this.storeService.loggedInUser
        .pipe(
          distinctUntilChanged(
            (prevUser, currentUser) => prevUser?.uid === currentUser?.uid
          )
        )
        .subscribe((user) => {
          if (!!user) {
            this.coinService.syncCoinCount();
            this.productService
              .fetchProducts({
                type: 'forJustForYou',
                query: {
                  tags: this.appService.getCommaSeparatedTags(
                    this.appConfigService.constants
                      .marketJustForYouProductsAssociatedTags
                  ),
                  end: this.storeService.initialProductFetchRangeTracker.current
                    .end,
                  start: this.storeService.initialProductFetchRangeTracker
                    .current.start,
                },
              })
              .then(({ result }) => {
                if (result?.length) {
                  this.storeService.productJustForYouProductsAvailabilityTracker.next(
                    true
                  );
                }
              });
          }
        });

      this.storeService.reloadWebsiteStream
        .pipe(filter((val) => val === true))
        .subscribe(() => {
          this.websiteReloaderService.reloadApp();
        });
      this.sentryLoggerService.init();
      this.consoleLoggerService.init();

      // NOTIFICATION
      this.pushNotificationService.listenForNotification();
      this.pushNotificationService.listenForUser();
      this.pushNotificationService.listenForToken();

      this.appService.init();
      this.analyticsService.init();
      this.chatService.init();
      this.coinService.init();
      this.routingStateService.init();
      this.imageLazyLoaderService.init();
      this.productService.init();
      this.shoppingCartService.init();
      this.assetService.init();
      this.requestService.init();
      this.apiService.init();
      this.mixedPageService.init();
      this.referralCodeService.init();

      this.shareProductService.init();
      this.websiteReloaderService.init();
      this.appShareService.init();
      this.barteringService.init();

      this.barteringChatService.init();
      try {
        SplashScreen.hide();
        StatusBar.setStyle({
          style: StatusBarStyle.Light,
        });
        StatusBar.setOverlaysWebView({ overlay: false });
        StatusBar.show();
      } catch (error) {}
      console.log('INITIALIZATION COMPLETE', {
        firebaseUser: this.storeService.authFirebaseUser.data.value,
        currentUser: this.storeService.loggedInUser.value,
      });
      this.storeService.appInitializationComplete.next(true);
    });
    this.appEventService.onAppResume().subscribe(async (_) => {
      this.coinService.syncCoinCount();
      await this.websiteReloaderService.reloadIfNewDeploymentAvailable();
      await this.getFreshData();
    });
    this.appEventService.onAppPaused().subscribe((_) => {
      this.consoleLoggerService.saveToSentry();
    });
  }

  async getFreshData() {
    await this.appConfigService.getJsonData();
    await this.clearAppData();
    this.storeService.initialProductFetchRangeTracker = this.appService.getInitialRange(
      {
        incrementBy: this.appConfigService.constants
          .marketNumberOfItemsToFetchAtOnce,
      }
    );

    // this.forceUpdateService.checkForNewAppUpdate();
    this.userSessionService.createSessionId();
    this.productService.fetchProducts({
      type: 'forPopular',
      query: {
        start: this.storeService.initialProductFetchRangeTracker.current.start,
        end: this.storeService.initialProductFetchRangeTracker.current.end,
        tags: this.appService.getCommaSeparatedTags(
          this.appConfigService.constants.marketPopularProductsAssociatedTags
        ),
      },
    });
    this.productService.fetchMerchantList();
    this.productService.fetchProducts({
      type: 'forJustForYou',
      query: {
        start: this.storeService.initialProductFetchRangeTracker.current.start,
        end: this.storeService.initialProductFetchRangeTracker.current.end,
        tags: this.appService.getCommaSeparatedTags(
          this.appConfigService.constants.marketJustForYouProductsAssociatedTags
        ),
      },
    });
    this.productService.fetchProducts({
      type: 'forTodaysForage',
      query: {
        start: this.storeService.initialProductFetchRangeTracker.current.start,
        end: this.storeService.initialProductFetchRangeTracker.current.end,
      },
    });
    this.articleService.fetchArticles(
      this.storeService.initialProductFetchRangeTracker.current
    );
    this.productService.fetchHomePageCategoryProducts();

    this.coinService.getCoinActionList();
  }

  getDataFromAllServices() {
    const storeServiceData = {};
    Object.keys(this.storeService).forEach((key) => {
      if (
        this.storeService[key] &&
        this.storeService[key].data &&
        this.storeService[key].data?.getValue
      ) {
        storeServiceData[key] = this.storeService[key].data;
      }
    });
    return storeServiceData;
  }

  private async clearAppData() {
    this.storeService.merchantList.next([]);
    this.storeService.searchResultCache = [];
    this.storeService.routingStatePageNavigationUrlStackStream.next([]);
  }
}
