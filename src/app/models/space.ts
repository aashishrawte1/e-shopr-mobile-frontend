import { IMedia } from '.';

export interface ICreateNewSpace {
  owner: string;
  description: string;
  media: IMedia[];
}
export interface ISpaceComment {
  description: string;
  uniqueId: string;
}
