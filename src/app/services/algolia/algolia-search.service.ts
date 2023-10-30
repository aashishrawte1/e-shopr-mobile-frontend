import { Injectable } from '@angular/core';
import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch/lite';
import { first } from 'rxjs/operators';
import { useSubject } from '../../utils/useSubject';
import { AppService } from '../app.service';
import { StoreService } from '../store.service';
import { UserProfileService } from '../user-profile.service';
export interface IAlgoliaSearchConfig {
  searchClient: SearchClient;
  indexName: string;
}

export interface ISearchRowItem {
  merchant_name: string;
  image: string;
  product_id: string;
  title: string;
  tags: string;
}
export interface IAlgoliaHitsItem {
  merchant_name: string;
  image: string;
  product_id: string;
  title: string;
  _tags: Array<string>;
}

@Injectable({
  providedIn: 'root',
})
export class AlgoliaSearchService {
  private client$ = useSubject<SearchClient>(null);
  private algoliaProductConfig: IAlgoliaSearchConfig;
  private productSearchHelper: SearchIndex;
  private readonly productIndexSuffix = 'products';
  constructor(
    private userProfileService: UserProfileService,
    private appService: AppService,
    private storeService: StoreService
  ) {}
  async initialize() {
    this.client$.next(
      algoliasearch('2X7M0E30UV', 'dbef845d07061db6589a3915132bd2c5')
    );
    this.storeService.loggedInUser.subscribe((_) => {
      const usersCountry = this.userProfileService.getUsersCountry();
      const countryISOCode =
        this.appService
          .getCountrySpecificProp({
            propName: 'countryName',
            valueToCompare: usersCountry,
            propToGet: 'isoCode',
          })
          ?.toUpperCase() || 'SG';

      this.productSearchHelper = this.client$.value.initIndex(
        `${countryISOCode}-${this.productIndexSuffix}`
      );
    });
  }

  async findProductsForSearchTerm(
    searchTerm: string
  ): Promise<Array<ISearchRowItem>> {
    const data = await this.productSearchHelper.search<IAlgoliaHitsItem>(
      searchTerm,
      {
        ignorePlurals: true,
        offset: 0,
        length: 30,
      }
    );

    return data.hits.map((hit) => ({
      product_id: hit.product_id,
      merchant_name: hit._highlightResult.merchant_name.value,
      tags: hit._highlightResult._tags.map((h) => h.value).join(', '),
      title: hit._highlightResult.title.value,
      image: hit.image,
    }));
  }

  // private async getStructuredResults(res: SearchResponse<IAlgoliaHitsItem>) {
  //   // Tags that match keyword - 10
  //   // Merchant names that match keyword - 5
  //   // 5 products

  //   const highlighted = {
  //     tags: {},
  //     merchants: {},
  //     itemNames: {},
  //   };
  //   for (const h of res.hits) {
  //     // Saving tags
  //     const highlightedTags = h._highlightResult._tags
  //       .filter((t) => t.value.includes('<em>'))
  //       .map((t) => ({
  //         tag: t.value.replace('<em>', '').replace('</em>', ''),
  //         highlightHtml: t.value,
  //       }));
  //     for (const hTag of highlightedTags) {
  //       highlighted.tags[hTag.tag] = hTag;
  //     }

  //     // Merchant Highlights
  //     const merchantName = h._highlightResult.merchant_name;
  //     if (merchantName.matchedWords.length > 0) {
  //       const cleanMerchantName = merchantName.value
  //         .replace('<em>', '')
  //         .replace('</em>', '');
  //       highlighted.merchants[cleanMerchantName] = {
  //         merchantName: cleanMerchantName,
  //         highlightHtml: merchantName.value,
  //       };
  //     }

  //     // Merchant Highlights
  //     const productName = h._highlightResult.title;
  //     if (productName.matchedWords.length > 0) {
  //       const cleanMerchantName = merchantName.value
  //         .replace('<em>', '')
  //         .replace('</em>', '');
  //       highlighted.merchants[cleanMerchantName] = {
  //         merchantName: cleanMerchantName,
  //         highlightHtml: merchantName.value,
  //       };
  //     }
  //   }
  //   const trimmedResult = res.hits.map((h) => ({
  //     productId: h.product_id,
  //     highlightedResult: h._highlightResult,
  //   }));
  // }

  private async getSearchConfig(indexName: 'MY-products' | 'SG-products') {
    if (this.algoliaProductConfig) {
      return this.algoliaProductConfig;
    }
    this.algoliaProductConfig = {
      searchClient: await this.client$.pipe(first((f) => !!f)).toPromise(),
      indexName,
    } as IAlgoliaSearchConfig;
    return this.algoliaProductConfig;
  }
}
