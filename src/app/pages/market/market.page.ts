import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { CustomGoogleTagManagerService } from '../../services/custom-google-tag-manager.service';
import { filter, first } from 'rxjs/operators';
import { PageRoutes } from '../../constants';
import {
  ActiveFilterItem,
  ApiCallStatusType,
  FetchProductsFnEntity,
  IProductResult,
  IRangeTracker,
} from '../../models';
import { MarketPageData, SortingType } from '../../models/app-data.model';
import { gtmEventNames } from '../../models/gtm-event.model';
import { AppConfigService } from '../../services/app-config.service';
import { AppService } from '../../services/app.service';
import { ProductFetcherService } from '../../services/product-fetcher.service';
import { RoutingStateService } from '../../services/routing-state.service';
import { StaticAssetService } from '../../services/static-asset.service';
import { StoreService } from '../../services/store.service';
import PageObserverComponent from '../../utils/component-observer.util';
import { useSubject } from '../../utils/useSubject';
@Component({
  selector: 'user-portal-market',
  templateUrl: './market.page.html',
  styleUrls: ['./market.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketPageComponent
  extends PageObserverComponent
  implements OnInit {
  @ViewChild('productsContainer') content: IonContent;
  iconsSets: { [key: string]: { selected: string; unselected: string } };
  rangeTracker: IRangeTracker;
  products = useSubject<IProductResult[]>([]);
  pageConfig: MarketPageData;
  dynamicFilterList: ActiveFilterItem[] = [];
  staticFilterList: ActiveFilterItem[] = [];
  hasMoreProducts = true;
  productFetchStatus: ApiCallStatusType = 'inProgress';
  currentSelectedFilter: ActiveFilterItem;
  popularProductTagText: string;
  routerState: any;
  quickSearchIcon: string;

  sortingIndicatorText: string;
  filterListType: 'dynamic' | 'static' = 'static';
  sortingModalActive: boolean;
  gtmPageBottomHit: boolean;

  constructor(
    private navController: NavController,
    private cdr: ChangeDetectorRef,
    public asset: StaticAssetService,
    private productService: ProductFetcherService,
    public appConfigService: AppConfigService,
    private appService: AppService,
    private routingStateService: RoutingStateService,
    public storeService: StoreService,
    private gtmService: CustomGoogleTagManagerService
  ) {
    super();
  }

  doRefresh(event: any) {
    event.target.complete();
    this.cdr.detectChanges();
  }

  async ngOnInit() {
    this.rangeTracker = this.appService.getInitialRange({
      incrementBy: this.appConfigService.constants
        .marketNumberOfItemsToFetchAtOnce,
    });
    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.marketPage;
      if (!this.sortingIndicatorText) {
        this.sortingIndicatorText = this.pageConfig.sorting.find(
          (s) => s.selectionValue === 'best-match'
        ).selectionIndicatorText;
      }

      this.staticFilterList[0] = {
        selected:
          this.getCurrentSelection()?.text ===
          this.appConfigService.constants.marketPopularProductsTagText
            ? true
            : false,
        type: 'tag',
        text: this.appConfigService.constants.marketPopularProductsTagText,
        associatedTags: this.appConfigService.constants
          .marketPopularProductsAssociatedTags,
      };

      this.storeService.productJustForYouProductsAvailabilityTracker
        .pipe(first((available) => available === true))
        .subscribe((_) => {
          this.staticFilterList[1] = {
            selected: false,
            type: 'tag',
            text: this.appConfigService.constants.marketJustForYouTagText,
            associatedTags: this.appConfigService.constants
              .marketJustForYouProductsAssociatedTags,
          };
          this.cdr.detectChanges();
        });

      // set icons
      this.iconsSets = {
        [this.appConfigService.constants.marketPopularProductsTagText]: {
          selected: this.storeService.json.pageConfig.value.icons
            .trendingSelectedImage,
          unselected: this.storeService.json.pageConfig.value.icons
            .trendingUnSelectedImage,
        },
        [this.appConfigService.constants.marketJustForYouTagText]: {
          selected: this.storeService.json.pageConfig.value.icons
            .justForYouSelectedImage,
          unselected: this.storeService.json.pageConfig.value.icons
            .justForYouUnSelectedImage,
        },
      };

      this.quickSearchIcon = this.storeService.json.pageConfig.value.icons.searchBirdImage;
    });

    this.observe(
      this.routingStateService.currentRoute.pipe(
        filter(({ url }) => !!url.includes(PageRoutes.fullUrls.market))
      ),
      (_) => {
        this.onPageWillEnter();
      }
    );
    this.onPageWillEnter();
  }

  onPageWillEnter() {
    if (!!this.checkIsDataPassedFromOtherPage()) {
      this.handleDataPassedFromOtherPages();
    } else {
      // if this is first time coming to this page then simply select popular products
      if (!!!this.currentSelectedFilter) {
        this.selectFilter({
          filterListType: 'static',
          queryItem: this.staticFilterList[0],
        });
      }
    }
    return true;
  }

  checkIsDataPassedFromOtherPage() {
    this.routerState = this.appService.getRouterState();
    if (!this.routerState?.activeFilter) {
      return null;
    }
    return this.routerState;
  }

  handleDataPassedFromOtherPages() {
    const data = this.checkIsDataPassedFromOtherPage();
    if (!!!data) {
      return;
    }
    const activeFilter = data.activeFilter as ActiveFilterItem;
    this.dynamicFilterList[0] = activeFilter;
    this.selectFilter({
      filterListType: 'dynamic',
      queryItem: this.dynamicFilterList[0],
    });
    this.cdr.detectChanges();
  }

  trackByProductIdFn(index: number, item: IProductResult) {
    return item.uniqueId;
  }

  filterListTrackByFn(index: number, item: ActiveFilterItem) {
    return item.text;
  }

  async onPageScrollEvent() {
    if (!this.hasMoreProducts) {
      return;
    }

    const scrollElement = await this.content.getScrollElement();
    if (
      scrollElement.scrollTop + scrollElement.clientHeight <=
      scrollElement.scrollHeight - 20
    ) {
      return;
    }
    this.appService.showLoader({ message: 'loading items...', duration: 1000 });
    this.rangeTracker = this.appService.getNewProductRange({
      currentTracker: this.rangeTracker,
      incrementBy: this.appConfigService.constants
        .marketNumberOfItemsToFetchAtOnce,
    });

    this.appService.debounce(
      this.getProductsFor({ queryItem: this.currentSelectedFilter }),
      3000
    );
  }

  async getProductsFor({
    queryItem,
    sortingType,
  }: {
    queryItem: ActiveFilterItem;
    sortingType?: SortingType;
  }) {
    const requestData: Partial<FetchProductsFnEntity> = {
      query: {
        start: this.rangeTracker.current.start,
        end: this.rangeTracker.current.end,
        sorting:
          sortingType ||
          this.pageConfig.sorting.find(
            (s) => s.selectionIndicatorText === this.sortingIndicatorText
          ).selectionValue,
      },
    };

    switch (queryItem.type) {
      case 'tag': {
        const commaSeparatedTags = this.appService.getCommaSeparatedTags(
          queryItem.associatedTags
        );
        requestData.query.tags = commaSeparatedTags;
        if (
          queryItem.text ===
          this.appConfigService.constants.marketJustForYouTagText
        ) {
          requestData.type = 'forJustForYou';
        } else if (
          queryItem.text ===
          this.appConfigService.constants.marketPopularProductsTagText
        ) {
          requestData.type = 'forPopular';
        } else {
          requestData.type = 'forTag';
        }
        break;
      }
      case 'merchant': {
        requestData.type = 'forMerchant';
        requestData.query.merchantId = queryItem.id;
        break;
      }
    }

    const { hasMoreProducts, result } = await this.productService.fetchProducts(
      requestData as FetchProductsFnEntity
    );

    this.hasMoreProducts = hasMoreProducts;

    try {
      this.gtmPageBottomHit = !this.hasMoreProducts;
      if (this.gtmPageBottomHit) {
        this.gtmService.recordEvent({
          event: gtmEventNames.marketPageListExhausted,
          text: requestData.query.searchTerm,
        });
      }
    } catch (error) {}
    if (!result?.length) {
      if (!this.products.value?.length) {
        this.productFetchStatus = 'empty';
        this.cdr.detectChanges();
      }
      return;
    }

    this.productFetchStatus = 'completed';
    this.products.value.push(...result);
    this.products.next(this.products.value);
    this.cdr.detectChanges();
  }

  openSearchPage({
    clickedItem,
  }: {
    clickedItem: 'noResultSearchAgainButtonClick' | 'topSearchBar' | 'bird';
  }) {
    try {
      if (clickedItem === 'noResultSearchAgainButtonClick') {
        this.gtmService.recordEvent({
          event: gtmEventNames.marketPageSearchAgainNoResultButtonClick,
        });
      } else if (clickedItem === 'bird') {
        this.gtmService.recordEvent({
          event: gtmEventNames.marketPageBirdIconClick,
        });
      } else if (clickedItem === 'topSearchBar') {
        this.gtmService.recordEvent({
          event: gtmEventNames.marketPageSearchInputClick,
        });
      }
    } catch (error) {}
    this.navController.navigateForward(PageRoutes.fullUrls.productSearch);
  }

  async openFilterModel() {
    this.sortingModalActive = true;
    const userSelection = await new Promise((resolve) => {
      const returnValue = (value: string): void => {
        resolve(value);
      };

      this.appService.showActionSheet({
        header: 'Sort Product',
        backdropDismiss: false,
        buttons: [
          ...this.pageConfig.sorting.map((s) => ({
            text: s.selectionText,
            handler: () => returnValue(s.selectionValue),
          })),
          {
            text: 'Cancel',
            role: 'destructive',
            handler: () => returnValue(null),
          },
        ],
      });
    });

    this.sortingModalActive = false;
    this.cdr.detectChanges();
    if (!userSelection) {
      return;
    }
    this.selectFilter({
      filterListType: this.filterListType,
      queryItem: this.currentSelectedFilter,
      sortingIndicatorText: this.pageConfig.sorting.find(
        (s) => s.selectionValue === userSelection
      ).selectionIndicatorText,
    });
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.marketPageSortingDropdownClick,
        selectedSorting: userSelection,
      });
    } catch (error) {}
  }

  getColorForTheTag(queryItem: ActiveFilterItem) {
    if (
      queryItem.text === this.appConfigService.constants.marketJustForYouTagText
    ) {
      return 'danger';
    } else if (
      queryItem.text ===
      this.appConfigService.constants.marketPopularProductsTagText
    ) {
      return 'warning';
    }
    return 'dark';
  }

  selectFilter({
    filterListType,
    queryItem,
    sortingIndicatorText = this.sortingIndicatorText,
  }: {
    filterListType: 'dynamic' | 'static';
    queryItem: ActiveFilterItem;
    sortingIndicatorText?: string;
  }) {
    try {
      if (filterListType === 'static') {
        const text = queryItem.text.replace(/ /g, '').toLowerCase();
        if (text.includes('trending')) {
          this.gtmService.recordEvent({
            event: gtmEventNames.marketPageTrendingTagClick,
          });
        } else if (text.includes('justforyou')) {
          this.gtmService.recordEvent({
            event: gtmEventNames.marketPageJustForYouClick,
          });
        }
      }
    } catch (error) {}
    if (
      this.currentSelectedFilter?.text === queryItem.text &&
      this.sortingIndicatorText === sortingIndicatorText
    ) {
      return;
    }

    if (this.currentSelectedFilter?.text !== queryItem.text) {
      sortingIndicatorText = this.pageConfig.sorting.find(
        (s) => s.selectionValue === 'best-match'
      ).selectionIndicatorText;
    }
    this.rangeTracker = this.appService.getInitialRange({
      incrementBy: this.appConfigService.constants
        .marketNumberOfItemsToFetchAtOnce,
    });
    this.sortingIndicatorText = sortingIndicatorText;
    this.filterListType = filterListType;
    this.products.next([]);
    this.hasMoreProducts = true;
    this.productFetchStatus = 'inProgress';
    this.appService.scrollElementIntoView('.market .pageTopIndicator');
    switch (filterListType) {
      case 'dynamic': {
        // clear selection from static list
        this.staticFilterList.forEach((i) => (i.selected = false));
        this.dynamicFilterList.forEach(
          (i) => (i.selected = i.text === queryItem.text ? true : false)
        );
        break;
      }
      case 'static': {
        this.dynamicFilterList.forEach((i) => (i.selected = false));
        this.staticFilterList.forEach(
          (i) => (i.selected = i.text === queryItem.text ? true : false)
        );
        break;
      }
    }
    this.currentSelectedFilter = queryItem;
    this.getProductsFor({
      queryItem,
      sortingType: this.pageConfig.sorting.find(
        (s) => s.selectionIndicatorText === this.sortingIndicatorText
      ).selectionValue,
    });
    this.cdr.detectChanges();
  }

  getCurrentSelection() {
    return [...this.staticFilterList, ...this.dynamicFilterList].find(
      (item) => item.selected
    );
  }
  onProductClick(product: IProductResult) {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.marketPageProductClick,
        productTitle: product.title,
        productId: product.uniqueId,
      });
    } catch (error) {}
  }
}
