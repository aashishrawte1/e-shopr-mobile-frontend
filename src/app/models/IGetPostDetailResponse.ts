import { ApiResponse, PostDetailEntity } from '.';

export interface IGetPostDetailResponse extends ApiResponse {
  result: PostDetailEntity;
}
