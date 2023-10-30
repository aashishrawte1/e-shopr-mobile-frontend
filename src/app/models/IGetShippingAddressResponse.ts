import { ApiResponse } from '.';

export interface IGetShippingAddressResponse extends ApiResponse {
  result: IShippingAddressEntity;
}

export interface IShippingAddressEntity {
  noteToSeller?: string;
  postalCode?: string;
  address?: string;
  name: string;
  email: string;
  phone?: {
    code: string;
    number: string;
  };
}
