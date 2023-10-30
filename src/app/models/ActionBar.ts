import { ActionItemType, PostsEntity, IProductResult } from '.';

export interface IActionButton {
  label: 'Share' | 'Great' | 'Comment' | 'Add to cart';
  iconName?: 'happy' | 'share' | 'chatbubbles' | 'cart';
  active?: boolean;
  buttonType?: 'icon' | 'button';
  externalUrl?: boolean;
  url?: string;
}

export type IActionButtonType = 'Share' | 'Great' | 'Comment' | 'Add to cart';

export interface IActionBarData {
  actionType: ActionItemType;
  item: PostsEntity | IProductResult;
}
