import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonContent, ModalController, NavController } from '@ionic/angular';
import { from } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { CustomModalComponent } from '../../components/custom-modal/custom-modal.component';
import { FullScreenImageViewerComponent } from '../../components/full-screen-image-viewer/full-screen-image-viewer.component';
import { VideoViewerComponent } from '../../components/video-viewer/video-viewer.component';
import {
  HOME_PAGE_FEATURED_SLIDER_CONFIG,
  HOME_PAGE_POPULAR_ITEMS_SLIDER_CONFIG,
  PageRoutes,
} from '../../constants';
import {
  ActiveFilterItem,
  ArticleEntity,
  IProductResult,
  IRangeTracker,
  ITurtlePickItem,
  PostDetailEntity,
} from '../../models';
import {
  AppBanner,
  HomePageData,
  IHomePageFeaturedCategoriesConfig,
  IPlayGroundSectionItem,
} from '../../models/app-data.model';
import { CoinActionItem } from '../../models/coin-action-list.model';
import { AppConfigService } from '../../services/app-config.service';
import { AppService } from '../../services/app.service';
import { CoinService } from '../../services/coin.service';
import { ProductFetcherService } from '../../services/product-fetcher.service';
import { RoutingStateService } from '../../services/routing-state.service';
import { StaticAssetService } from '../../services/static-asset.service';
import { StoreService } from '../../services/store.service';
import { UserProfileService } from '../../services/user-profile.service';
import PageObserverComponent from '../../utils/component-observer.util';
import { useSubject } from '../../utils/useSubject';
import { sleep } from '../../utils/sleep.util';
import { CustomGoogleTagManagerService } from '../../services/custom-google-tag-manager.service';
import { gtmEventNames } from '../../models/gtm-event.model';
import { IMerchantInfo } from '../../models/IMerchantResult';
import { IGetArticleItemsResponse } from '../../models/IGetArticleItemsResponse';

@Component({
  selector: 'user-portal-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent extends PageObserverComponent implements OnInit {
  @ViewChild('homePageScrollContainer') content: IonContent;
  featuredCategoriesProducts: Array<IProductResult[]> = [];
  featuredSliderConfig = HOME_PAGE_FEATURED_SLIDER_CONFIG;
  popularSliderConfig = HOME_PAGE_POPULAR_ITEMS_SLIDER_CONFIG;
  merchants: ActiveFilterItem[] = [];
  dailyLoginRewardConditions = useSubject<CoinActionItem>(null);
  pageConfig: HomePageData;
  popularArticles: ArticleEntity[] = [];
  appBanners: AppBanner[] = [];
  popularProducts: IProductResult[] = [];
  turtlePicks: ITurtlePickItem[] = [];
  todaysForageItems: IProductResult[] = [];
  playgroundSectionItems: IPlayGroundSectionItem[] = [];
  homePageFeaturedCategories: Array<IHomePageFeaturedCategoriesConfig> = [];
  splitCategoryList: ActiveFilterItem[][] = [];
  productFetchRange: IRangeTracker;
  gtmPageBottomHit: boolean;
  justForYouProducts: Array<IProductResult> = [];
  constructor(
    private cdr: ChangeDetectorRef,
    private modalController: ModalController,
    public assetService: StaticAssetService,
    private appService: AppService,
    private coinService: CoinService,
    private productService: ProductFetcherService,
    public appConfigService: AppConfigService,
    private navController: NavController,
    private routingStateService: RoutingStateService,
    public storeService: StoreService,
    private userProfileService: UserProfileService,
    private gtmService: CustomGoogleTagManagerService
  ) {
    super();
  }

  async doRefresh(event: any) {
    this.fetchLatestProducts();
    await sleep(1000);
    event.target.complete();
  }

  async ngOnInit() {
    from(
      this.coinService.getCoinInfoForAction({
        actionType: 'daily_login_reward',
      })
    ).subscribe((rewardConditions) => {
      this.dailyLoginRewardConditions.next(rewardConditions);
    });

    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.homePage;
      this.cdr.detectChanges();
    });
    this.observe(
      this.storeService.json.homePageFeaturedCategories,
      (config) => {
        this.homePageFeaturedCategories = config;
        this.cdr.detectChanges();
      }
    );

    this.observe(this.storeService.json.playgroundData, (config) => {
      this.playgroundSectionItems = config.playGroundSectionItems;
      this.cdr.detectChanges();
    });

    this.storeService.loggedInUser
      .pipe(
        distinctUntilChanged(
          (prevUser, currentUser) => prevUser?.uid === currentUser?.uid
        )
      )
      .subscribe(() => {
        const country = this.userProfileService.getUsersCountry();
        this.appBanners = this.storeService.json.banners.value.filter(
          (b) => b.countries.indexOf(country) !== -1
        );
        this.cdr.detectChanges();
      });

    this.observe(
      this.storeService.articles.pipe(filter((articles) => !!articles?.length)),
      async (articles) => {
        this.popularArticles = this.appService.getRandomItems(
          articles,
          articles.length >
            this.appConfigService.constants.homeNumberOfPopularArticlesToShow
            ? this.appConfigService.constants.homeNumberOfPopularArticlesToShow
            : articles.length
        );
        this.cdr.detectChanges();
      }
    );

    this.fetchLatestTurtlePicks();

    this.observe(
      this.routingStateService.currentRoute.pipe(
        filter(({ url }) => !!url?.includes(PageRoutes.fullUrls.home))
      ),
      async (_) => {
        this.onPageEnter();
      }
    );

    this.observe(this.storeService.homePageCategoryProducts, (data) => {
      this.featuredCategoriesProducts = data;
      this.cdr.detectChanges();
    });

    this.fetchLatestProducts();

    const categoryList = this.productService.getCategoryList();

    this.splitCategoryList = this.splitArrayInHalf(categoryList);

    this.productService.fetchMerchantList().then((merchantList) => {
      this.merchants = merchantList.slice(
        0,
        this.appConfigService.constants.homeNumberOfMerchantsToShow
      );
      this.cdr.detectChanges();
    });
  }

  fetchLatestProducts() {
    if (this.productFetchRange?.current.end) {
      this.productFetchRange = this.appService.getNewProductRange({
        currentTracker: this.productFetchRange,
        incrementBy: this.appConfigService.constants
          .homeNumberOfPopularProductsToShow,
      });
    } else {
      this.productFetchRange = this.appService.getInitialRange({
        incrementBy: this.appConfigService.constants
          .homeNumberOfPopularProductsToShow,
      });
    }
    this.productService
      .fetchProducts({
        type: 'forPopular',
        query: {
          tags: this.appService.getCommaSeparatedTags(
            this.appConfigService.constants.marketPopularProductsAssociatedTags
          ),
          end: this.productFetchRange.current.end,
          start: this.productFetchRange.current.start,
        },
      })
      .then(({ result }) => {
        this.popularProducts = this.appService.getRandomItems(
          this.popularProducts,
          this.popularProducts.length
        );
        if (
          result?.length !==
          this.appConfigService.constants.homeNumberOfPopularProductsToShow
        ) {
          return;
        }
        this.popularProducts = result;
        this.cdr.detectChanges();
      });

    this.productService
      .fetchProducts({
        type: 'forTodaysForage',
        query: {
          end: this.productFetchRange.current.end,
          start: this.productFetchRange.current.start,
        },
      })
      .then(({ result }) => {
        this.todaysForageItems = result;
        this.cdr.detectChanges();
      });
  }

  fetchLatestTurtlePicks() {
    this.productService.getTurtlePicks().then((res) => {
      this.turtlePicks = res;
      this.cdr.detectChanges();
    });
  }

  async onPageEnter() {
    this.fetchLatestTurtlePicks();
    this.fetchJustForYou();
  }

  async fetchJustForYou() {
    this.productService
      .fetchProducts({
        type: 'forJustForYou',
        query: {
          end: this.productFetchRange.current.end,
          start: this.productFetchRange.current.start,
        },
      })
      .then((val) => {
        this.justForYouProducts = val?.result;
        this.cdr.detectChanges();
      });
  }

  gotoMarketPage() {
    this.navController.navigateRoot(PageRoutes.fullUrls.market);
  }

  gotoCommunityPage() {
    this.navController.navigateRoot(PageRoutes.fullUrls.community);
  }

  gotoPostDetail(article: PostDetailEntity) {
    this.navController.navigateForward(
      `${PageRoutes.shortUrls.articleDetail}/${article.uniqueId}`
    );
  }

  async onTopBannerClick(banner: AppBanner) {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.homePageBannerClick,
        banner,
      });
    } catch (error) {}
    if (banner.action === 'dailyLoginReward') {
      if (!this.storeService.loggedInUser.value) {
        this.navController.navigateRoot(PageRoutes.fullUrls.login);
        return;
      }
      this.coinService.giveDailyReward();
      return;
    } else if (banner.action === 'openExternalPageWithinApp') {
      this.appService.openInAppBrowser({ url: banner.link });
      return;
    }
    this.appService.handleAppNavigationData(banner);
  }

  goToPage(url: string) {
    if (!url) {
      return;
    }
    this.navController.navigateForward(url);
  }
  async getFilterByTag(
    activeFilter: ActiveFilterItem,
    eventType: 'dynamicTagViewMoreClick' | 'categoryItemClick'
  ) {
    try {
      const gtmData = {} as any;
      if (eventType === 'dynamicTagViewMoreClick') {
        gtmData.event = gtmEventNames.homePageDynamicTagViewMoreClick;
      } else if (eventType === 'categoryItemClick') {
        gtmData.event = gtmEventNames.homePageCategoryItemClick;
      }
      if (!this.appService.isObjectEmpty(gtmData)) {
        this.gtmService.recordEvent(gtmData);
      }
    } catch (error) {}

    this.navController.navigateRoot(PageRoutes.fullUrls.market, {
      state: { activeFilter: { ...activeFilter, selected: true } },
    });
  }
  async openPlaygroundItem(playgroundItem: IPlayGroundSectionItem) {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.homePagePlaygroundSectionItemClick,
        title: playgroundItem.text,
      });
    } catch (error) {}
    if (playgroundItem.action === 'fullScreenImage') {
      const modalRefSub = useSubject<HTMLIonModalElement>(null);
      const componentProps = {
        modalRefSub,
        data: {
          imageUrl: playgroundItem.data.fullScreenImageUrl,
        },
        componentToLoad: FullScreenImageViewerComponent,
      };

      const modalRef = await this.modalController.create({
        component: CustomModalComponent,
        componentProps,
        backdropDismiss: false,
        cssClass: ['full-page-modal'],
      });
      modalRefSub.next(modalRef);
      await modalRef.present();
    } else if (playgroundItem.action === 'video') {
      const modalRefSub = useSubject<HTMLIonModalElement>(null);
      const componentProps = {
        modalRefSub,
        data: {
          videoUrl: playgroundItem.data.videoUrl,
        },
        componentToLoad: VideoViewerComponent,
      };

      const modalRef = await this.modalController.create({
        component: CustomModalComponent,
        componentProps,
        backdropDismiss: false,
        cssClass: ['full-page-modal'],
      });
      modalRefSub.next(modalRef);
      await modalRef.present();
    } else if (playgroundItem.action === 'goToPage') {
      if (!playgroundItem.redirectTo) {
        return;
      }
      this.navController.navigateForward(playgroundItem.redirectTo, {
        state: playgroundItem.data,
      });
    }
  }

  splitArrayInHalf(list: any[]) {
    const length = list.length;
    const halfLength = (length - (length % 2 === 0 ? 0 : 1)) / 2;
    const newArray = [
      [...list.slice(0, halfLength)],
      [...list.slice(halfLength, halfLength * 2)],
    ];
    return newArray;
  }

  gotoProductDetail(
    product: any,
    eventType?:
      | 'turtlePick'
      | 'trendingSection'
      | 'dynamicTagProductItemClick'
      | 'justForYouTagClick'
  ) {
    try {
      const gtmData = {} as any;
      if (eventType === 'trendingSection') {
        gtmData.event = gtmEventNames.homePageTrendingSectionItemClick;
      } else if (eventType === 'turtlePick') {
        gtmData.event = gtmEventNames.homePageTurtlePickItemClick;
      } else if (eventType === 'dynamicTagProductItemClick') {
        gtmData.event = gtmEventNames.homePageDynamicTagItemClick;
      }

      if (!this.appService.isObjectEmpty(gtmData)) {
        gtmData.productTitle = product.title;
        gtmData.productId = product.uniqueId;
        this.gtmService.recordEvent(gtmData);
      }
    } catch (error) {}

    this.productService.goToProductDetailPage({ product });
  }

  goToProductSearchPage(
    eventOrigin: 'searchButtonClick' | 'viewMoreCategoryLinkClick'
  ) {
    try {
      const gtmData = {} as any;
      if (eventOrigin === 'searchButtonClick') {
        gtmData.event = gtmEventNames.homePageSearchButtonClick;
      } else if (eventOrigin === 'viewMoreCategoryLinkClick') {
        gtmData.event = gtmEventNames.homePageCategoryViewMoreClick;
      }
      if (!this.appService.isObjectEmpty(gtmData)) {
        this.gtmService.recordEvent(gtmData);
      }
    } catch (error) {}
    this.navController.navigateForward(PageRoutes.fullUrls.productSearch);
  }

  goToProfilePage() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.homePageGemIconClick,
      });
    } catch (error) {}
    this.navController.navigateForward(PageRoutes.fullUrls.profile);
  }

  merchantTrackByFn(index: number, item: ActiveFilterItem) {
    return item?.id;
  }

  productTrackByFn(index: number, item: IProductResult) {
    return item?.uniqueId;
  }

  articlesTrackByFn(index: number, item: ArticleEntity) {
    return item?.uniqueId;
  }

  turtlePicksTrackByFn(index: number, item: ITurtlePickItem) {
    if (!index) {
      return;
    }
    return item.uniqueId + item.numberOfLikes;
  }

  onMenuClick() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.homePageMenuHamburgerIconClick,
      });
    } catch (error) {}
  }

  onMerchantClick(merchant: IMerchantInfo) {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.homePageMerchantItemClick,
        merchantName: merchant.fullName,
        merchantId: merchant.uniqueId,
      });
    } catch (error) {}
  }

  onArticleClick(article: ArticleEntity) {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.homePageReadSectionItemClick,
        articleTitle: article.title,
      });
    } catch (error) {}
  }

  onTodayForageItemClick(product: IProductResult) {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.homePageTodaysForageItemClick,
        productTitle: product.title,
        productId: product.uniqueId,
      });
    } catch (error) {}
  }

  async onScrollEnd() {
    const scrollElement = await this.content.getScrollElement();
    if (this.gtmPageBottomHit) {
      return;
    }
    if (
      scrollElement.scrollTop + scrollElement.clientHeight <=
      scrollElement.scrollHeight - 20
    ) {
      return;
    }
    this.gtmPageBottomHit = true;
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.homePageBottomHit,
      });
    } catch (error) {}
  }
}
