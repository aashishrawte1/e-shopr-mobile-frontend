export type UserActionType =
  | 'product_view'
  | 'daily_login_reward'
  | 'referee_claimed'
  | 'referer_awarded'
  | 'referer_shared_code'
  | 'share_product';
export const USER_ACTION_TYPES: {
  [key in UserActionType]: string;
} = {
  product_view: 'product_view',
  daily_login_reward: 'daily_login_reward',
  referee_claimed: 'referee_claimed',
  referer_awarded: 'referer_awarded',
  referer_shared_code: 'referer_shared_code',
  share_product: 'share_product',
};
