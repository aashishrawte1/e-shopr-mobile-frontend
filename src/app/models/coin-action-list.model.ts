import { ApiResponse } from '.';
import { UserActionType } from '../constants';
import { CoinTypes } from './user-coin-activity.model';

export interface ICoinActionListApiResponse extends ApiResponse {
  result?: CoinActionItem[] | null;
}

export class CoinActionItem {
  actionType: UserActionType;
  rewardType: CoinTypes;
  conditions: CoinRewardConditions;
  coins: number;
}

export class CoinRewardConditions {
  rewardAfter?: number | null;
  startTimerAfter?: number | null;
  onlyOnceEveryDay?: boolean | null;
  bannerMessageWhenNotLoggedIn?: string;
  bannerMessageWhenLoggedIn?: string;
}
