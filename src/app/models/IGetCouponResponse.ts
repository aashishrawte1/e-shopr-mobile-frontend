import { ApiResponse } from '.';

export interface IGetCouponResponse extends ApiResponse {
  result: ICouponResult;
}

export interface ICouponResult {
  couponCode: string;
  couponValue: number;
  discountType: '$' | '%';
  country: string;
  error?: string;
}
