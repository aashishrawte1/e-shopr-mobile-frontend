import { ICartItem } from '.';

export interface IMerchantStore {
  [key: string]: {
    [key: string]: ICartItem;
  };
}
