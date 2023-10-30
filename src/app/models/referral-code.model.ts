import { ApiResponse } from '.';

export interface IReferralCodeApiResponse extends ApiResponse {
  result?: ReferralCodeItem;
}

export class ReferralCodeItem {
  referralCode: string;
}
