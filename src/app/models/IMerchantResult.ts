import { ApiResponse } from '.';

export interface IGetMerchantsResponse extends ApiResponse {
  result: IMerchantInfo[];
}
export interface IMerchantInfo {
  uniqueId: string;
  fullName: string;
  avatarUrl?: string;
  selected?: boolean;
}
