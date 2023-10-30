import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Plugins } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { debounceTime } from 'rxjs/operators';
import { PageRoutes } from '../../constants/routes';
import { ActiveFilterItem } from '../../models';
import {
  ISearchFilterSection,
  SearchFilterSectionCategorySection,
} from '../../models/app-data.model';
import { gtmEventNames } from '../../models/gtm-event.model';
import {
  AlgoliaSearchService,
  IAlgoliaSearchConfig,
  ISearchRowItem,
} from '../../services/algolia/algolia-search.service';
import { AppService } from '../../services/app.service';
import { CustomGoogleTagManagerService } from '../../services/custom-google-tag-manager.service';
import { StaticAssetService } from '../../services/static-asset.service';
import { StoreService } from '../../services/store.service';
import PageObserverComponent from '../../utils/component-observer.util';
import { useSubject } from '../../utils/useSubject';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { Keyboard } = Plugins;

@Component({
  selector: 'user-portal-product-search',
  templateUrl: './product-search.page.html',
  styleUrls: ['./product-search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSearchPageComponent
  extends PageObserverComponent
  implements OnInit {
  @ViewChild('searchBar') myInput: any;
  loadingProductsMessage = 'Loading...';
  filtersData: ISearchFilterSection[];
  activeSegment: string;
  segmentList: string[];
  selectedCategory: string;
  subCategories: SearchFilterSectionCategorySection[];
  mainCategoryList: { text: string; icon: string }[];
  merchantList: ActiveFilterItem[];
  searchTerm$ = useSubject<string>(null);
  searchResults: Array<ISearchRowItem> = [];
  algoliaProductConfig: IAlgoliaSearchConfig;
  constructor(
    public assetService: StaticAssetService,
    private navController: NavController,
    private cdr: ChangeDetectorRef,
    private appService: AppService,
    private storeService: StoreService,
    private gtmService: CustomGoogleTagManagerService,
    private algoliaSearchService: AlgoliaSearchService
  ) {
    super();
  }

  ngOnInit() {
    this.observe(this.storeService.json.productSearchFilterData, (value) => {
      this.filtersData = value;

      const categoryItemIndex = this.filtersData.findIndex(
        (item) => item.text === 'Categories'
      );
      this.mainCategoryList = this.filtersData[categoryItemIndex].list.map(
        (item: { text: string; icon: string }) => ({
          text: item.text,
          icon: item.icon,
        })
      );

      this.selectedCategory = this.filtersData[categoryItemIndex].list[0].text;
      this.subCategories = this.filtersData[categoryItemIndex].list[0].list;

      this.segmentList = this.filtersData.map((item) => item.text);
      this.activeSegment =
        this.activeSegment || this.segmentList[categoryItemIndex];
    });
    this.cdr.detectChanges();

    this.searchTerm$.pipe(debounceTime(300)).subscribe((val) => {
      if (!val) {
        this.searchResults = [];
      } else {
        this.algoliaSearchService.findProductsForSearchTerm(val).then((res) => {
          this.searchResults = res;
          this.cdr.detectChanges();
        });
      }
    });
  }
  ionViewDidEnter() {
    setTimeout(() => {
      this.myInput.setFocus();
    }, 150);
  }

  async onSearchTermEnterPressed(searchTerm: string) {
    Keyboard.hide();
    if (!searchTerm?.trim()) {
      return;
    }

    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.filterPageSearchBoxDropdownItemClick,
        searchTerm,
      });
    } catch (error) {}
    this.navController.navigateForward(PageRoutes.fullUrls.searchResult, {
      state: {
        searchTerm,
      },
    });
  }

  goBack() {
    this.navController.navigateRoot(PageRoutes.fullUrls.market, {
      replaceUrl: true,
    });
  }

  segmentChanged(activeSegment: string) {
    try {
      const trimmedVal = activeSegment.replace(/ /g, '').trim().toLowerCase();
      if (trimmedVal === 'categories') {
        this.gtmService.recordEvent({
          event: gtmEventNames.filterPageCategoriesSectionClick,
        });
      } else if (trimmedVal === 'merchants') {
        this.gtmService.recordEvent({
          event: gtmEventNames.filterPageMerchantsSectionClick,
        });
      } else if (trimmedVal === 'special') {
        this.gtmService.recordEvent({
          event: gtmEventNames.filterPageSpecialSectionClick,
        });
      }
    } catch (error) {}
    this.activeSegment = activeSegment;
    Keyboard.hide();
  }

  async fetchProductsFor({
    type,
    query,
  }: {
    type: 'tag' | 'merchant' | 'specialTag';
    query: ActiveFilterItem;
  }) {
    try {
      const gtmData = { text: query.text };
      if (type === 'tag') {
        this.gtmService.recordEvent({
          ...gtmData,
          event: gtmEventNames.filterPageCategoriesSectionItemClick,
        });
      } else if (type === 'merchant') {
        this.gtmService.recordEvent({
          ...gtmData,
          event: gtmEventNames.filterPageMerchantSectionMerchantItemClick,
        });
      } else if (type === 'specialTag') {
        this.gtmService.recordEvent({
          ...gtmData,
          event: gtmEventNames.filterPageSpecialSectionTagItemClick,
        });
      }
    } catch (error) {}
    const dataForMarket: Partial<ActiveFilterItem> = await this.appService.cloneObject(
      query
    );
    dataForMarket.type = type === 'specialTag' ? 'tag' : type;
    dataForMarket.text =
      query.text.toLowerCase() === 'all' ? this.selectedCategory : query.text;
    dataForMarket.selected = true;
    this.navController.navigateBack(PageRoutes.fullUrls.market, {
      state: {
        activeFilter: dataForMarket,
      },
      replaceUrl: true,
    });
  }

  onScrollStart() {
    Keyboard.hide();
  }

  searchResultTrackByFn(index: number, item: ISearchRowItem) {
    return item.product_id;
  }

  goToProductDetailPage(item: ISearchRowItem) {
    this.navController.navigateForward(
      `${PageRoutes.fullUrls.productDetail}?uniqueId=${item.product_id}`
    );
  }
}
