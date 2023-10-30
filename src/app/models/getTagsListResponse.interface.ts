import { ApiResponse } from '.';

export interface IGetTagsListResponse extends ApiResponse {
  result: Tag[];
}

export interface Tag {
  text: string;
  selected: boolean;
}
