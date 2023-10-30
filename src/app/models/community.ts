import { IMedia, Statistics, IComment } from '.';

export interface Community {
  posts?: PostsEntity[] | null;
  spaces?: PostsEntity[] | null;
}
export interface PostsEntity {
  uniqueId: string;
  ownerName: string;
  title: string;
  description: string;
  media?: IMedia[] | null;
  statistics: Statistics;
  type: CommunityItemTypes;
  avatarUrl: string;
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

export interface PostDetailEntity extends PostsEntity {
  comments: IComment[];
}

export type CommunityItemTypes = 'post' | 'article';
export interface CommunityItem {
  selected: boolean;
  text: 'Posts' | 'Articles';
  value: CommunityItemTypes;
}
