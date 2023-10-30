import { IMedia } from '.';

export interface ICreateNewPost {
  title: string;
  description: string;
  media: IMedia[];
}
