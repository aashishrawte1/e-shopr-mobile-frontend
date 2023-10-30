import { ApiResponse, PostsEntity } from '.';

export interface IGetPostItemsResponse extends ApiResponse {
  result: PostsEntity[];
}
