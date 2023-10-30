import { ApiResponse, ICartItem, IMedia } from '.';

export interface IGetProductsResponse extends ApiResponse {
  result: IProductResult[] | ICartItem[];
}

export interface IGetCartResponse extends ApiResponse {
  result: ICartItem[];
}

export interface IProductResult {
  uniqueId: string;
  media: IMedia[];
  owner: string;
  ownerName: string;
  price: number;
  originalPrice: number;
  title: string;
  description: IProductDescriptionItem[];
  delivery: {
    fee: number;
    description: string;
  };
  origin: string;
  tags: { [key: string]: CategoryEntity };
  relatedItemTags: string;
  avatarUrl: string;
  statistics: IProductStatistics;
  inStock: boolean;
}

export interface IProductStatistics {
  userReactions: {
    likesCount: number;
  };
  currentUser: {
    liked: boolean;
    skipped: boolean;
  };
}

export interface IProductDescriptionItem {
  type: 'header' | 'content';
  text: 'Story' | 'Product' | 'Delivery' | 'Source' | string;
}

export interface CategoryEntity {
  key: string;
  value: boolean;
}

export interface SingleProductApiResponse extends ApiResponse {
  result: IProductResult;
}
