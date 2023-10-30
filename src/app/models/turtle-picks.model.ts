import { ApiResponse, IMedia } from '.';

export interface ITurtlePickItem {
  uniqueId: string;
  media: IMedia[];
  numberOfLikes: number;
  owner: string;
}

export interface IGetTurtlePicksResponse extends ApiResponse {
  result: ITurtlePickItem[];
}
