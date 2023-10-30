import { IProductResult } from '.';
import { SortingType } from './app-data.model';

export interface ICartItem extends IProductResult {
  count: number;
  noteToSeller: string;
}

export interface FetchProductsFnEntity {
  type:
    | 'forTodaysForage'
    | 'forMerchant'
    | 'forJustForYou'
    | 'forPopular'
    | 'forTag'
    | 'forSearchTerm'
    | 'relatedProducts';
  query: {
    start: number;
    end: number;
    searchTerm?: string;
    tags?: string;
    merchantId?: string;
    currentProduct?: {
      ownerId: string;
      ownerName: string;
      tags: string;
      title: string;
      uniqueId: string;
    };
    sorting?: SortingType;
  };
}

export type ApiCallStatusType = 'inProgress' | 'completed' | 'empty';

export interface ActiveFilterItem {
  type: 'tag' | 'merchant';
  text: string;
  selected: boolean;
  associatedTags?: string[];
  id?: string;
  avatar?: string;
  icon?: string;
}
