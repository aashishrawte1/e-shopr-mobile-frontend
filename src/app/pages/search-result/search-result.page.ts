import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { PageRoutes } from '../../constants';
import { ApiCallStatusType, IProductResult, IRangeTracker } from '../../models';
import { SearchPageComponentData } from '../../models/app-data.model';
import { AppConfigService } from '../../services/app-config.service';
import { AppService } from '../../services/app.service';
import { StaticAssetService } from '../../services/static-asset.service';
import { ProductFetcherService } from '../../services/product-fetcher.service';
import PageObserverComponent from '../../utils/component-observer.util';
import { useSubject } from '../../utils/useSubject';
import { StoreService } from '../../services/store.service';
import { CustomGoogleTagManagerService } from '../../services/custom-google-tag-manager.service';
import { gtmEventNames } from '../../models/gtm-event.model';

@Component({
  selector: 'user-portal-search-result',
  templateUrl: './search-result.page.html',
  styleUrls: ['./search-result.page.scss'],
})
export class SearchResultPageComponent
  extends PageObserverComponent
  implements OnInit {
  @ViewChild('productsContainer') content: IonContent;
  searchTerm = '';
  rangeTracker: IRangeTracker;
  products = useSubject<IProductResult[]>([]);

  productFetchStatus: ApiCallStatusType = 'inProgress';
  numberOfProductsToFetchAtOnce: number;
  pageConfig: SearchPageComponentData;
  hasMoreProducts = true;
  routerState: { searchTerm: string; merchantId: string };
  gtmPageBottomHit: boolean;
  gtmIsInitialSearchResultRecorded = false;
  merchantId: string;
  constructor(
    private navCtrl: NavController,
    private productService: ProductFetcherService,
    private appService: AppService,
    private storeService: StoreService,
    public assetService: StaticAssetService,
    private appConfigService: AppConfigService,
    private gtmService: CustomGoogleTagManagerService
  ) {
    super();
    this.numberOfProductsToFetchAtOnce = this.appConfigService.constants.marketNumberOfItemsToFetchAtOnce;
  }

  async ngOnInit() {
    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.productSearchFilterData;
    });
  }

  async ionViewWillEnter() {
    // get first set of data
    this.routerState = this.appService.getRouterState() || this.routerState;
    if (this.routerState.searchTerm !== this.searchTerm) {
      //GTM
      this.gtmIsInitialSearchResultRecorded = false;
      this.searchTerm = this.routerState.searchTerm;
      this.merchantId = this.routerState.merchantId;
      this.rangeTracker = this.appService.getInitialRange({
        incrementBy: this.appConfigService.constants
          .marketNumberOfItemsToFetchAtOnce,
      });
      this.productFetchStatus = 'inProgress';
      this.products.next([]);
      this.getProducts();
    }
  }

  async onPageScrollEvent() {
    if (!this.hasMoreProducts) {
      return;
    }
    const scrollElement = await this.content.getScrollElement();
    if (
      !(
        scrollElement.scrollTop + scrollElement.clientHeight >=
        scrollElement.scrollHeight - 20
      )
    ) {
      return;
    }
    this.appService.showLoader({ message: 'loading items...', duration: 1000 });
    this.rangeTracker = this.appService.getNewProductRange({
      currentTracker: this.rangeTracker,
      incrementBy: this.appConfigService.constants
        .marketNumberOfItemsToFetchAtOnce,
    });
    this.appService.debounce(this.getProducts(), 3000);
  }

  async getProducts() {
    let hasMoreProducts: boolean;
    let result: Array<IProductResult>;
    if (this.merchantId) {
      const apiResult = await this.productService.fetchProducts({
        type: 'forMerchant',
        query: {
          merchantId: this.merchantId,
          start: this.rangeTracker.current.start,
          end: this.rangeTracker.current.end,
        },
      });
      hasMoreProducts = apiResult.hasMoreProducts;
      result = apiResult.result;
    } else {
      const apiResult = await this.productService.fetchProducts({
        type: 'forSearchTerm',
        query: {
          searchTerm: this.searchTerm,
          start: this.rangeTracker.current.start,
          end: this.rangeTracker.current.end,
        },
      });
      hasMoreProducts = apiResult.hasMoreProducts;
      result = apiResult.result;
    }

    this.hasMoreProducts = hasMoreProducts;
    const cacheSearchString = this.merchantId || this.searchTerm;
    try {
      if (!this.hasMoreProducts) {
        const formattedCacheKey = this.productService.getFormattedCacheKey(
          cacheSearchString
        );
        const searchRecord = this.storeService.searchResultCache.find(
          (item) =>
            this.productService.getFormattedCacheKey(item.searchTerm) ===
            formattedCacheKey
        );
        const totalNumberOfProductsShownToUser = Object.values(
          searchRecord || []
        ).reduce((acc, val) => acc.concat(val), []).length;
        if (totalNumberOfProductsShownToUser > 0) {
          this.gtmService.recordEvent({
            event: gtmEventNames.searchResultPageBottomHit,
            totalNumberOfProductsShownToUser,
          });
        }
      }

      if (!this.gtmIsInitialSearchResultRecorded) {
        this.gtmIsInitialSearchResultRecorded = true;
        this.gtmService.recordEvent({
          event: gtmEventNames.searchResultPageSearchTermResult,
          initialNumberOfProductsLoaded: result?.length,
          hasMoreItems: hasMoreProducts,
        });
      }
    } catch (error) {}

    if (!result?.length) {
      this.productFetchStatus = 'empty';
      return;
    }

    this.productFetchStatus = 'completed';
    this.products.value.push(...result);
    this.products.next(this.products.value);
  }

  trackByFn(index: number, item: IProductResult) {
    return item?.uniqueId;
  }

  goBack() {
    this.navCtrl.back();
  }

  goBackToSearchPage() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.searchResultPageSearchIconClick,
        searchTerm: this.searchTerm,
      });
    } catch (error) {}
    this.goBack();
  }

  goToCartPage() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.searchResultPageCartIconClick,
        searchTerm: this.searchTerm,
      });
    } catch (error) {}
    this.goBack();
    this.navCtrl.navigateForward(PageRoutes.fullUrls.shoppingCart);
  }

  onProductClick(product: IProductResult) {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.searchResultPageItemClick,
        searchTerm: this.searchTerm,
        productTitle: product.title,
        productId: product.uniqueId,
      });
    } catch (error) {}
  }
}
