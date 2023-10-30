import { ApiResponse } from '.';

export interface IGetArticleItemsResponse extends ApiResponse {
  result: ArticleEntity[];
}

export interface ArticleEntity {
  uniqueId: string;
  owner: string;
  url: string;
  title: string;
  favicon?: string[] | null;
  siteName: string;
  mediaType: string;
  description: string;
  images?: string[] | null;
}
