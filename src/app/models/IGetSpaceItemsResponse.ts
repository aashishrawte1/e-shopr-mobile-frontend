import { ApiResponse, PostsEntity } from '.';

export interface IGetSpaceItemsResponse extends ApiResponse {
  result: PostsEntity[];
}
