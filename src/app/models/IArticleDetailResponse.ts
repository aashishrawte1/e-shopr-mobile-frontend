import { ApiResponse, PostDetailEntity } from '.';

export interface IArticleDetailResponse extends ApiResponse {
  result: PostDetailEntity;
}
