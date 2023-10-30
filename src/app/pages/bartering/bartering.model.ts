import { ApiResponse, IProductStatistics } from '../../models';

export interface IBarteringProductsApiResponse extends ApiResponse {
  result?: IBarteringProductItem[];
}

export interface IBarteringProductDetailsApiResponse extends ApiResponse {
  result?: IBarteringProductItem;
}

export class IBarteringProductItem {
  productId: string;
  postedBy: string;
  title: string;
  description: string;
  priceMin: number;
  priceMax: number;
  tags: string;
  images: Array<string>;
  userImage: string;
  userName: string;
  selected?: boolean;
  disliked: boolean;
  statistics: IProductStatistics;
  relevancyScore: string;
}

export interface IBarteringMessageFB {
  time: string;
  message: string;
  author: {
    uid: string;
    name: string;
  };
}

export interface IBarteringMessageExtra extends IBarteringMessageFB {
  displayTime: string;
}

export interface IBarteringChatListItemFB {
  lastMessage: IBarteringMessageFB;
  members: {
    [key: string]: {
      uid: string;
      name: string;
      avatarUrl: string;
    };
  };
  productsInfo: {
    [key: string]: {
      image: string;
      title: string;
    };
  };

  barteringLevel: 2 | 3;
}

export interface IBarteringChatListItemProductInfo {
  memberName: string;
  profilePicture: string;
  productImage: string;
  productTitle: string;
  memberId: string;
}
export interface IBarteringChatListDisplayItem {
  barteringLevel: 2 | 3;
  lastMessage: string;
  lastMessageTime: string;
  isLastMessageByCurrentUser: boolean;
  partiesInvolved: Array<IBarteringChatListItemProductInfo>;
  allProductIds: string;
}
