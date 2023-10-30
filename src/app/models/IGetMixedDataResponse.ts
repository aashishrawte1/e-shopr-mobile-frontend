import { ApiResponse, IProductResult, ArticleEntity } from '.';

export interface IGetMixedDataResponse extends ApiResponse {
  result: IMixedDataResult;
}

export interface IMixedDataResult {
  products: IProductResult[];
  links: ArticleEntity[];
  tags: string;
  type: string;
}
