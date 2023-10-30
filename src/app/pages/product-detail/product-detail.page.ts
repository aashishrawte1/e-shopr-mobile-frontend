import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { NavController } from '@ionic/angular';
import { CustomGoogleTagManagerService } from '../../services/custom-google-tag-manager.service';
import { Subscription } from 'rxjs';
import { filter, first, map } from 'rxjs/operators';
import {
  DETAIL_PAGE_SLIDER_CONFIG,
  PageRoutes,
  YOUTUBE_VIDEO_ID_MATCHER_REGEX,
} from '../../constants';
import {
  ActiveFilterItem,
  CustomToastOptionsEntity,
  IActionBarData,
  IMedia,
  IProductResult,
} from '../../models';
import {
  ICountryDetail,
  IProgressBarTriggerCondition,
  ProductDetailPageData,
} from '../../models/app-data.model';
import { gtmEventNames } from '../../models/gtm-event.model';
import { AnalyticService } from '../../services/analytic.service';
import { AppConfigService } from '../../services/app-config.service';
import { AppService } from '../../services/app.service';
import { CoinService } from '../../services/coin.service';
import { ProductFetcherService } from '../../services/product-fetcher.service';
import { ProductShareService } from '../../services/product-share.service';
import { RoutingStateService } from '../../services/routing-state.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { SmartLookService } from '../../services/smart-look.service';
import { StaticAssetService } from '../../services/static-asset.service';
import { StoreService } from '../../services/store.service';
import PageObserverComponent from '../../utils/component-observer.util';
import { isHtmlInViewport } from '../../utils/html-in-viewport.util';
import { useSubject } from '../../utils/useSubject';
import { IChatType } from '../chat/chat.page';
import { ChatService } from './../../services/chat.service';

interface ProgressBarTriggerConditionsTracker
  extends IProgressBarTriggerCondition {
  fulfilled: boolean;
}
@Component({
  selector: 'user-portal-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPageComponent
  extends PageObserverComponent
  implements OnInit, OnDestroy {
  icons: { like: { selected: string; unselected: string }; share: string };
  likeStatus: boolean;
  headerHasBackground = true;
  sliderConfig = DETAIL_PAGE_SLIDER_CONFIG;
  product: IProductResult;
  relatedProducts: IProductResult[] = [];
  cartItemCount: number;
  actionBarData: IActionBarData;
  _tags: Array<string> = [];
  contentDescriptionShowStatusMap = [];
  swiperRef: any;
  newMessageCount: number;
  showMoreDelivery: boolean;
  productOrigin: any;
  countryFlag: any;

  progressBarData = useSubject<{
    duration: number;
    progressBarColor: string;
    requiredTriggerCount: number;
    fillBar?: boolean;
  }>(null);

  merchantOriginCountryDetails = {} as ICountryDetail;
  progressBarTriggerConditionsTracker = {} as Array<ProgressBarTriggerConditionsTracker>;
  productViewStatusCheckerSub: Subscription;
  pageConfig: ProductDetailPageData;
  descriptionCharCountInLessShowMode: number;
  progressTriggerTimestamp: number;
  progressBarHint: string;
  progressBarPercent: number;
  progressBarHintTimeout: NodeJS.Timeout;
  display = [];
  displayDelivery = false;
  constructor(
    private navController: NavController,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private photoViewer: PhotoViewer,
    private shoppingCartService: ShoppingCartService,
    private coinService: CoinService,
    public asset: StaticAssetService,
    private chatService: ChatService,
    private analytics: AnalyticService,
    private productService: ProductFetcherService,
    private appConfigService: AppConfigService,
    public storeService: StoreService,
    private routingStateService: RoutingStateService,
    private appService: AppService,
    private productShareService: ProductShareService,
    private smartLookService: SmartLookService,
    private activatedRoute: ActivatedRoute,
    private gtmService: CustomGoogleTagManagerService
  ) {
    super();
  }
  async doRefresh(event: any) {
    this.productService.fetchProductByUniqueId(this.product?.uniqueId);
    event.target.complete();
  }

  async ngOnInit() {
    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.productDetailPage;
      this.icons = {
        like: {
          selected: config.icons.likeIconFilled,
          unselected: config.icons.likeIconOutline,
        },
        share: config.icons.shareIcon,
      };
      this.cdr.detectChanges();
    });
    this.observe(this.storeService.shoppingCart, async (_) => {
      this.cartItemCount = await this.shoppingCartService.getTotalItemCountInCart();
      this.cdr.detectChanges();
    });
    this.observe(
      this.storeService.greenConciergeChatNewMessageCounterStream,
      (val) => {
        this.newMessageCount = val || 0;
        this.cdr.detectChanges();
      }
    );

    // First Time
    this.observe(
      this.activatedRoute.queryParamMap.pipe(
        first((val: any) => !!val),
        map((val) => val.params)
      ),
      async ({ uniqueId }) => {
        this.loadPageData({ uniqueId });
      }
    );
    this.subscribeToRouteChange();
  }

  async subscribeToRouteChange() {
    this.observe(
      this.routingStateService.currentRoute.pipe(
        filter(({ url }) => !!url?.includes(PageRoutes.fullUrls.productDetail))
      ),
      async ({ url, params }) => {
        this.loadPageData({ uniqueId: params.uniqueId });
      }
    );
  }

  async loadPageData({ uniqueId }: { uniqueId: string }) {
    this.descriptionCharCountInLessShowMode = this.appConfigService.constants.productDetailDescriptionCharCountInLessShowMode;
    this.progressBarData.next(null);
    this.product = null;
    this.product = await this.productService.fetchProductByUniqueId(uniqueId);
    this.merchantOriginCountryDetails =
      this.appService.getCountryDetail({
        propName: 'isoCode',
        valueToCompare: this.product?.origin,
      }) || ({} as ICountryDetail);
    // Log product view event
    this.analytics.logEvent(
      this.storeService.analyticFacebookEvents.EVENT_NAME_VIEWED_CONTENT,
      {
        url: location.href,
        item: {
          uniqueId: this.product.uniqueId,
          price: this.product.price,
          itemName: this.product.title,
        },
      }
    );

    if (this.product.tags) {
      this._tags = Object.keys(this.product.tags).map((key) => '#' + key);
    }
    const range = this.appService.getInitialRange({
      incrementBy: this.appConfigService.constants
        .marketNumberOfItemsToFetchAtOnce,
    });

    await this.productService
      .fetchProducts({
        type: 'relatedProducts',
        query: {
          currentProduct: {
            ownerId: this.product.owner,
            ownerName: this.product.ownerName,
            title: this.product.title,
            tags: Object.keys(this.product.tags).join(','),
            uniqueId: this.product.uniqueId,
          },
          tags: this.product.relatedItemTags,
          start: range.current.start,
          end: range.current.end,
        },
      })
      .then(({ result: relatedProducts }) => {
        this.relatedProducts = relatedProducts;
        this.cdr.detectChanges();
      });

    this.product.media[0].show = true;
    if (this.product.description) {
      this.contentDescriptionShowStatusMap = this.product.description.map(
        (_) => {
          return {
            show: 'less',
          };
        }
      );
    }
    this.appService.scrollElementIntoView('.product-detail .pageTopIndicator');
    this.setupProgressBar({ productId: uniqueId });
    this.cdr.detectChanges();
  }

  async setupProgressBar({ productId }: { productId: string }) {
    if (!productId) {
      return;
    }
    this.progressBarTriggerConditionsTracker = this.appService.cloneObject(
      this.pageConfig.progressBar.triggerConditions.map((tc) => ({
        ...tc,
        fulfilled: false,
      }))
    );
    this.progressTriggerTimestamp = null;
    this.cdr.detectChanges();

    const status = await this.coinService
      .checkIfProductViewed({ itemId: productId })
      .pipe(first((val) => !!(val && val.itemId === productId)))
      .toPromise();
    this.progressBarData.next({
      progressBarColor: this.pageConfig.progressBar.barFillColor,
      duration: this.pageConfig.progressBar.duration,
      requiredTriggerCount: this.pageConfig.progressBar.requiredTriggerCount,
      fillBar: status.claimed,
    });
    if (!status.claimed) {
      this.progressBarHintTimeout = setTimeout(() => {
        this.progressBarHint = this.progressBarTriggerConditionsTracker.find(
          (item) => !item.fulfilled
        )?.triggerHint;
        this.cdr.detectChanges();
      }, 2000);
    }
  }

  onChatClick() {
    const chatType: IChatType = 'withGreenDay';
    this.navController
      .navigateForward(PageRoutes.fullUrls.chat, {
        state: {
          chatType,
        },
      })
      .then((_) => {
        this.chatService.initiateChatForAction({
          type: 'greenday_initiated_product_query_message',
          product: this.product,
        });
      });
  }

  async goBack() {
    this.location.back();
  }

  async addToCart() {
    if (!this.storeService.loggedInUser.value) {
      this.navController.navigateForward(PageRoutes.fullUrls.login, {
        replaceUrl: true,
      });

      try {
        this.gtmService.recordEvent({
          event: gtmEventNames.productDetailPageAddToCartClickWhenNotLoggedIn,
          productId: this.product.uniqueId,
          productTitle: this.product.title,
        });
      } catch (error) {}
      return;
    }
    this.gtmService.recordEvent({
      event: gtmEventNames.productDetailPageAddToCartClickWhenLoggedIn,
      productId: this.product.uniqueId,
      productTitle: this.product.title,
    });
    this.shoppingCartService.addItem({
      merchantId: this.product.owner,
      item: this.product,
    });
    this.logEvent();
  }

  async openCartModal() {
    if (!this.storeService.loggedInUser.value) {
      this.navController.navigateForward(PageRoutes.fullUrls.login, {
        replaceUrl: true,
      });
      return;
    }
    this.navController.navigateForward(PageRoutes.fullUrls.shoppingCart);
  }

  async logEvent() {
    const dataToSendForAnalytics = {
      productId: this.product.uniqueId,
      price: this.product.price,
      itemName: this.product.title,
    };
    await this.analytics.logEvent(
      this.storeService.analyticFacebookEvents.EVENT_NAME_ADDED_TO_CART,
      dataToSendForAnalytics
    );
    this.smartLookService.logEvent({
      eventName: 'add_to_cart',
      data: dataToSendForAnalytics,
    });
  }

  async buyNow() {
    if (!this.storeService.loggedInUser.value) {
      this.navController.navigateForward(PageRoutes.fullUrls.login, {
        replaceUrl: true,
      });
      try {
        this.gtmService.recordEvent({
          event: gtmEventNames.productDetailPageBuyNowClickWhenNotLoggedIn,
          productId: this.product.uniqueId,
          productTitle: this.product.title,
        });
      } catch (error) {}
      return;
    }
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.productDetailPageBuyNowClickWhenNotLoggedIn,
        productId: this.product.uniqueId,
        productTitle: this.product.title,
      });
    } catch (error) {}
    this.logEvent();
    await this.shoppingCartService.addItem({
      merchantId: this.product.owner,
      item: this.product,
    });
    this.navController.navigateForward(PageRoutes.fullUrls.checkout);
  }

  getYouTubeVideoId(url: string) {
    const ytRegex = YOUTUBE_VIDEO_ID_MATCHER_REGEX;

    const matchSet = url.match(ytRegex);
    if (matchSet && matchSet.length === 2) {
      return matchSet[1];
    }
  }

  async goToSlide(index: number) {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.productDetailPageThumbnailClick,
        productTitle: this.product.title,
        productId: this.product.uniqueId,
        thumbnailImage: this.product.media[index].link,
      });
    } catch (error) {}
    this.product.media.forEach((m) => (m.show = false));
    this.product.media[index].show = true;
    this.cdr.detectChanges();
  }

  onShowClick(idx: string | number, showStatus: string) {
    this.contentDescriptionShowStatusMap[idx].show = showStatus;
    this.cdr.detectChanges();
  }

  openViewer(media: IMedia) {
    try {
      const data = {
        productId: this.product.uniqueId,
        productTitle: this.product.title,
        image: media.link,
      } as any;
      if (media.type === 'image') {
        this.gtmService.recordEvent({
          event: gtmEventNames.productDetailPageImageEnlarged,
          ...data,
        });
      } else if (media.type === 'video') {
        this.gtmService.recordEvent({
          event: gtmEventNames.productDetailPageVideoPlayed,
          ...data,
        });
      }
    } catch (error) {}
    if (media.type === 'image') {
      this.photoViewer.show(media.link);
    }
  }

  toggleDelivery(mode: 'more' | 'less') {
    this.showMoreDelivery = mode === 'more' ? true : false;
  }

  goToHome() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.productDetailPageHomeIconClick,
      });
    } catch (error) {}
    this.navController.navigateRoot(`${PageRoutes.fullUrls.home}`, {
      replaceUrl: true,
    });
  }

  goToLoginPage() {
    this.navController.navigateRoot(PageRoutes.fullUrls.login, {
      replaceUrl: true,
    });
  }

  async openMarketPageWithMerchantSelected() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.productDetailPageMerchantClick,
        merchantName: this.product.ownerName,
        productTitle: this.product.title,
        productId: this.product.uniqueId,
      });
    } catch (error) {}
    this.navController.navigateForward(PageRoutes.fullUrls.searchResult, {
      state: {
        merchantId: this.product.owner,
        searchTerm: this.product.ownerName,
      },
    });
  }

  async toggleLike(uniqueId: string) {
    if (!this.storeService.loggedInUser.value) {
      this.navController.navigateForward(PageRoutes.fullUrls.login, {
        replaceUrl: true,
      });
      try {
        this.gtmService.recordEvent({
          event: gtmEventNames.productDetailPageLikeIconClickWhenNotLoggedIn,
          productId: this.product.uniqueId,
          productTitle: this.product.title,
          action:
            !this.product.statistics.currentUser.liked === true
              ? 'liked'
              : 'removedLike',
        });
      } catch (error) {}
      return;
    }
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.productDetailPageLikeIconClickWhenLoggedIn,
        productId: this.product.uniqueId,
        productTitle: this.product.title,
        action:
          !this.product.statistics.currentUser.liked === true
            ? 'liked'
            : 'removedLike',
      });
    } catch (error) {}
    await this.productService.setProductLikeStatus({ uniqueId });
    this.product.statistics.currentUser.liked = !this.product.statistics
      .currentUser.liked;

    const message = this.product.statistics.currentUser.liked
      ? this.pageConfig.likeOptions.toastOptions.onProductLikeClickMessage
      : this.pageConfig.likeOptions.toastOptions.onProductUnLikeClickMessage;
    const toastOptions: CustomToastOptionsEntity = {
      position: 'bottom',
      animated: true,
      cssClass: ['type-1-toast'],
      message,
      duration: this.pageConfig.likeOptions.toastOptions.toastShowDuration,
    };
    if (this.pageConfig.likeOptions.toastOptions.showToastActionButton) {
      toastOptions.buttons = [
        {
          side: 'end',
          cssClass: 'type-1-toast-action-button',
          text: this.pageConfig.likeOptions.toastOptions.toastButtonText,
          handler: () => {
            this.navController.navigateForward(PageRoutes.fullUrls.likes);
          },
        },
      ];
    }
    this.appService.showToast(toastOptions);
    this.cdr.detectChanges();
  }

  async shareProduct(): Promise<void> {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.productDetailPageShareIconClick,
        productId: this.product.uniqueId,
        productTitle: this.product.title,
      });
    } catch (error) {}
    this.productShareService.shareProduct({ product: this.product });
  }

  async onScroll() {
    if (!this.progressBarTriggerConditionsTracker?.length) {
      return;
    }
    this.progressBarHint = null;
    const isConditionFulfilled = this.progressBarTriggerConditionsTracker.find(
      (i) => i.id === 'element_in_view'
    ).fulfilled;
    if (isConditionFulfilled) {
      this.cdr.detectChanges();
      return;
    }
    const elementSelector = this.progressBarTriggerConditionsTracker.find(
      (i) => i.id === 'element_in_view'
    )?.config.elementSelector;
    if (!elementSelector) {
      return;
    }
    const element = document.querySelector(elementSelector);
    const hasUserReachedBottom = isHtmlInViewport(element);
    if (!hasUserReachedBottom) {
      return;
    }
    this.progressTriggerTimestamp = +new Date();
    this.progressBarTriggerConditionsTracker.find(
      (i) => i.id === 'element_in_view'
    ).fulfilled = true;
    this.cdr.detectChanges();
  }

  onBarFilled() {
    this.coinService.saveActivity({
      actionType: 'product_view',
      data: {
        itemId: this.product.uniqueId,
      },
    });
  }

  async onScrollStart() {
    if (!this.progressBarTriggerConditionsTracker?.length) {
      return;
    }
    const isConditionFulfilled = this.progressBarTriggerConditionsTracker?.find(
      (i) => i.id === 'scroll_start'
    ).fulfilled;
    if (isConditionFulfilled) {
      return;
    }
    this.progressTriggerTimestamp = +new Date();
    this.progressBarTriggerConditionsTracker.find(
      (i) => i.id === 'scroll_start'
    ).fulfilled = true;
  }

  onProgressBarUpdate(percent: number) {
    this.progressBarPercent = percent;
    this.progressBarHint = null;
    this.cdr.detectChanges();
    clearTimeout(this.progressBarHintTimeout);

    if (percent !== 100) {
      this.progressBarHintTimeout = setTimeout(() => {
        this.progressBarHint = this.progressBarTriggerConditionsTracker.find(
          (item) => !item.fulfilled
        )?.triggerHint;
        this.cdr.detectChanges();
      }, 2000);
    }
  }
  onGemCircleClick() {
    this.gtmService.recordEvent({
      event: gtmEventNames.productDetailPageGemIconClick,
      productId: this.product.uniqueId,
      productTitle: this.product.title,
    });
  }

  onYouMayAlsoLikeItemClick(product: IProductResult) {
    this.gtmService.recordEvent({
      event: gtmEventNames.productDetailPageYouMayAlsoLikeItemClick,
      productId: product.uniqueId,
      productTitle: product.title,
    });
  }
  async goToMarketPageWithTag(tag: string) {
    const dataForMarket: Partial<ActiveFilterItem> = {
      selected: true,
      type: 'tag',
      text: tag,
      associatedTags: [tag.replace(/#/g, '')],
    };
    this.navController.navigateBack(PageRoutes.fullUrls.market, {
      state: {
        activeFilter: dataForMarket,
      },
      replaceUrl: true,
    });
  }
  toggleDetail(idx: number) {
    this.display[idx] = !this.display[idx];
  }
  toggleDeliveryDetail() {
    this.displayDelivery = !this.displayDelivery;
  }
}
