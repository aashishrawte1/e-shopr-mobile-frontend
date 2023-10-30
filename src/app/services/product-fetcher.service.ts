import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PageRoutes } from '../constants';
import {
  ActiveFilterItem,
  ApiResponse,
  FetchProductsFnEntity,
  IProductResult,
} from '../models';
import { hashCode } from '../utils/hashCode';
import { ApiService } from './api.service';
import { AppConfigService } from './app-config.service';
import { AppService } from './app.service';
import { StoreService } from './store.service';
@Injectable({
  providedIn: 'root',
})
export class ProductFetcherService {
  constructor(
    private storeService: StoreService,
    private apiService: ApiService,
    private navController: NavController,
    private appService: AppService,
    private appConfigService: AppConfigService
  ) {}

  async init() {}

  getFormattedCacheKey(key: string) {
    return key.toLowerCase().replace(/ /g, '');
  }

  checkCache({ rangeKey, cacheKey }: { rangeKey: string; cacheKey: string }) {
    const formattedCacheKey = this.getFormattedCacheKey(cacheKey);
    const searchRecord = this.storeService.searchResultCache.find(
      (item) => this.getFormattedCacheKey(item.searchTerm) === formattedCacheKey
    );

    if (
      !!searchRecord &&
      rangeKey in searchRecord.range &&
      searchRecord.range[rangeKey]?.length > 0
    ) {
      return {
        result: searchRecord.range[rangeKey],
        hasMoreProducts:
          searchRecord.lastRangeKey === rangeKey
            ? searchRecord.hasMoreProducts
            : true,
      };
    }
    return null;
  }

  saveIntoCache({
    cacheKey,
    result,
    rangeKey,
    start,
    end,
  }: {
    cacheKey: string;
    result: IProductResult[];
    rangeKey: string;
    start: number;
    end: number;
  }) {
    const formattedCacheKey = this.getFormattedCacheKey(cacheKey);
    const searchRecord = this.storeService.searchResultCache.find(
      (item) => this.getFormattedCacheKey(item.searchTerm) === formattedCacheKey
    );
    const hasMoreProducts = this.checkIfApiCanLoadMoreProducts({
      list: result,
      start,
      end,
    });

    if (!!searchRecord) {
      searchRecord.range[rangeKey] = result;
      searchRecord.hasMoreProducts = hasMoreProducts;
      searchRecord.lastRangeKey = rangeKey;
    } else {
      this.storeService.searchResultCache.push({
        searchTerm: formattedCacheKey,
        hasMoreProducts,
        lastRangeKey: rangeKey,
        range: {
          [rangeKey]: result,
        },
      });
    }
  }

  checkIfApiCanLoadMoreProducts({
    list,
    start,
    end,
  }: {
    list: IProductResult[];
    start: number;
    end: number;
  }) {
    return list?.length >= (start || end ? end - start : 99);
  }

  async fetchProducts({
    type,
    query: {
      start,
      end,
      searchTerm,
      tags,
      merchantId,
      currentProduct,
      sorting = 'best-match',
    },
  }: FetchProductsFnEntity): Promise<{
    hasMoreProducts: boolean;
    result: IProductResult[];
  }> {
    let cacheKey: string;
    switch (type) {
      case 'forJustForYou': {
        cacheKey = tags;
        break;
      }
      case 'forMerchant': {
        cacheKey = merchantId;
        break;
      }
      case 'forPopular': {
        cacheKey = tags;
        break;
      }
      case 'forSearchTerm': {
        cacheKey = searchTerm;
        break;
      }
      case 'forTag': {
        cacheKey = tags;
        break;
      }
      case 'forTodaysForage': {
        cacheKey = this.storeService.json.pageConfig.value.componentData
          .homePage.todayForage.header;
        break;
      }
      case 'relatedProducts': {
        cacheKey = hashCode(currentProduct.uniqueId);
        break;
      }
    }
    cacheKey = cacheKey + sorting;
    const rangeKey = `${start}_${end}`;
    const cache = this.checkCache({ cacheKey, rangeKey });
    if (!!cache) {
      return cache;
    }

    let response = {} as ApiResponse;

    switch (type) {
      case 'forJustForYou': {
        response = await this.apiService.fetchJustForYouProducts({
          start,
          end,
          sorting,
        });
        break;
      }
      case 'forMerchant': {
        response = await this.apiService.fetchProductsByOwner({
          start,
          end,
          ownerId: merchantId,
          sorting,
        });
        break;
      }
      case 'forPopular': {
        response = await this.apiService.fetchPopularProducts({
          start,
          end,
          sorting,
        });
        break;
      }
      case 'forSearchTerm': {
        response = await this.apiService.fetchProductsWithSearchTerms({
          searchTerm,
          start,
          end,
          sorting,
        });
        break;
      }
      case 'forTag': {
        response = await this.apiService.fetchProductsForTags({
          start,
          end,
          tags,
          sorting,
        });
        break;
      }
      case 'forTodaysForage': {
        response = await this.apiService.fetchTodaysForageItems({
          start,
          end,
          sorting,
        });
        break;
      }
      case 'relatedProducts': {
        response = await this.apiService.fetchRelatedProducts({
          start,
          end,
          tags,
          sorting,
        });
        break;
      }
    }

    const { status, result } = response;
    const { code, description } = status;
    if (code !== 200) {
      console.error('filter products error', { description });
      return { hasMoreProducts: true, result: [] };
    }

    this.saveIntoCache({ result, rangeKey, start, end, cacheKey });
    const hasMoreProducts = this.checkIfApiCanLoadMoreProducts({
      list: result,
      start,
      end,
    });
    return { result: result || [], hasMoreProducts };
  }
  async fetchProductByUniqueId(uniqueId: string) {
    const response = await this.apiService.fetchProductByUniqueId({
      uniqueId,
    });

    const { status, result } = response;
    const { code, description } = status;
    if (code !== 200) {
      console.error('single product fetch error', { description });
      return;
    }
    this.checkJustForYouAvailability();
    return result;
  }

  checkJustForYouAvailability() {
    if (
      this.storeService.productJustForYouProductsAvailabilityTracker.value ===
      true
    ) {
      return;
    }

    if (!!!this.storeService.loggedInUser.value) {
      return;
    }
    const { start, end } = this.appService.getInitialRange({
      incrementBy: this.appConfigService.constants
        .marketNumberOfItemsToFetchAtOnce,
    }).current;

    const commaSeparatedTags = this.appService.getCommaSeparatedTags(
      this.appConfigService.constants.marketJustForYouProductsAssociatedTags
    );
    const cache = this.fetchProducts({
      type: 'forJustForYou',
      query: {
        start,
        end,
        tags: commaSeparatedTags,
        sorting: 'best-match',
      },
    });
    if (!!this.appService.isObjectEmpty(cache)) {
      this.storeService.productJustForYouProductsAvailabilityTracker.next(true);
      return;
    }
  }

  goToProductDetailPage({ product }: { product: IProductResult }) {
    this.navController.navigateForward(
      `${PageRoutes.fullUrls.productDetail}?uniqueId=${encodeURIComponent(
        product.uniqueId
      )}`,
      { state: { product } }
    );
  }

  getCategoryList(): ActiveFilterItem[] {
    const categoryItemIndex = this.storeService.json.productSearchFilterData.value.findIndex(
      (item) => item.text === 'Categories'
    );
    const categoryList: ActiveFilterItem[] = this.storeService.json.productSearchFilterData.value[
      categoryItemIndex
    ].list.map((item) => ({
      text: item.text,
      icon: item.icon,
      selected: true,
      type: 'tag',
      associatedTags: item.list.find((i) => i.text.toLowerCase() === 'all')
        .associatedTags,
    }));
    return categoryList;
  }

  async fetchMerchantList(getFreshData?: boolean): Promise<ActiveFilterItem[]> {
    if (this.storeService.merchantList.value?.length && !getFreshData) {
      return this.storeService.merchantList.value;
    }

    const response = await this.apiService.fetchMerchantList({});
    const { status, result } = response;
    const { code, description } = status;
    if (code !== 200) {
      console.error('fetching-merchant-failed', { description });
      return;
    }
    const list: ActiveFilterItem[] = result.map((item) => ({
      selected: false,
      text: item.fullName,
      type: 'merchant',
      id: item.uniqueId,
      avatar: item.avatarUrl,
    }));
    const itemIndex = this.storeService.json.productSearchFilterData.value?.findIndex(
      (item) => item.text === 'Merchants'
    );
    if (itemIndex === -1) {
      this.storeService.json.productSearchFilterData.value.splice(1, 0, {
        text: 'Merchants',
        list,
      });
    } else {
      this.storeService.json.productSearchFilterData.value.splice(1, 1, {
        text: 'Merchants',
        list,
      });
    }
    this.storeService.merchantList.next(list);
    this.storeService.json.productSearchFilterData.next(
      this.storeService.json.productSearchFilterData.value
    );
    return list;
  }

  async getLikedProducts() {
    const response = await this.apiService.fetchLikedProducts();

    const { status, result } = response;
    const { code, description } = status;
    if (code !== 200) {
      console.error('liked products fetch failed', { description });
      return;
    }

    return result;
  }

  async getTurtlePicks() {
    const response = await this.apiService.fetchTurtlePicks();

    const { status, result } = response;
    const { code, description } = status;
    if (code !== 200) {
      console.error('turtle Picks products fetch failed', { description });
      return;
    }

    return result;
  }

  async setProductLikeStatus({ uniqueId }: { uniqueId: string }) {
    const response = await this.apiService.setProductLikeStatus({ uniqueId });

    const { status, result } = response;
    const { code } = status;
    if (code !== 200) {
      console.error('could not like product', { uniqueId });
      return;
    }

    return result;
  }

  async fetchHomePageCategoryProducts() {
    const initialRange = this.appService.getInitialRange({
      incrementBy: this.appConfigService.constants
        .homeNumberOfPopularProductsToShow,
    });
    const homePageCategoryDataPromises = [];
    const featuredCategories = this.storeService.json.homePageFeaturedCategories
      .value;
    for (const [key, value] of Object.entries(featuredCategories)) {
      if (value.data.activeFilter.type === 'tag') {
        homePageCategoryDataPromises.push(
          this.fetchProducts({
            type: 'forTag',
            query: {
              tags: this.appService.getCommaSeparatedTags(
                value.data.activeFilter.associatedTags
              ),
              end: initialRange.current.end,
              start: initialRange.current.start,
            },
          })
        );
      }
    }
    const data = (await Promise.all(homePageCategoryDataPromises)).map(
      (r) => r.result
    );
    this.storeService.homePageCategoryProducts.next(data);
    return data;
  }
}
