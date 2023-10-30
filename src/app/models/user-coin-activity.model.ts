import { UserActionType } from '../constants';
import { ApiResponse } from './api';

export type CoinTypes = 'type1' | 'type2' | 'type3' | 'type4';
export class UserCoinActivity {
  actionType: UserActionType;
  data: any;
}

/*
 type1 = greenGems
*/
export interface GetCoinsApiResponse extends ApiResponse {
  result: {
    [key in CoinTypes]: {
      count: number;
      value: number;
      coinConversionRate: number;
    };
  };
}

export interface ReferralCodeClaimStatus {
  claimed: boolean;
  referralCode: string;
}
