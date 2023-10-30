import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, filter, first, take } from 'rxjs/operators';
import { PageRoutes, UserActionType } from '../constants';
import { endpoints } from '../constants/endpoints';
import { ApiResponse } from '../models/api';
import { ICoinActionListApiResponse } from '../models/coin-action-list.model';
import {
  GetCoinsApiResponse,
  ReferralCodeClaimStatus,
  UserCoinActivity,
} from '../models/user-coin-activity.model';
import { AppService } from './app.service';
import { RequestService } from './request.service';
import { StoreService } from './store.service';

export class RewardTracker {
  productViewTracker: BehaviorSubject<{
    [key: string]: ProductViewClaimStatus;
  }>;

  dailyLoginRewardTracker: BehaviorSubject<{ claimed: boolean; date: string }>;
  referralCodeClaimTracker: BehaviorSubject<ReferralCodeClaimStatus>;
}

export class ProductViewClaimStatus {
  claimed: boolean;
  itemId: string;
}

@Injectable({
  providedIn: 'root',
})
export class CoinService {
  constructor(
    private appService: AppService,
    private requestService: RequestService,
    private navController: NavController,
    private storeService: StoreService
  ) {}

  async init() {
    this.storeService.loggedInUser
      .pipe(
        filter((user) => !!user),
        distinctUntilChanged()
      )
      .subscribe(async (_) => {
        await this.clearTracker();
      });
  }
  async giveDailyReward() {
    // Daily Login reward check is made when the app is launched.
    const claimStatus = await this.storeService.coinClaimsTracker.dailyLoginRewardTracker
      .pipe(take(1))
      .toPromise();
    const date = this.appService.getFormattedDate(
      this.storeService.coinDailyLoginRewardDateFormat
    );
    if (claimStatus?.claimed && claimStatus?.date === date) {
      this.appService.showAlert({
        header: 'Already claimed 🥳',
        message: 'You have claimed your gems for today. Come back tomorrow.',
      });
    } else {
      const claimed = await this.checkIfLoginRewardClaimedAlready();
      this.storeService.coinClaimsTracker.dailyLoginRewardTracker.next({
        claimed,
        date,
      });
      if (!claimed) {
        this.saveActivity({
          actionType: 'daily_login_reward',
          data: null,
        });
      }
    }
  }

  async getCoinInfoForAction({ actionType }: { actionType: UserActionType }) {
    return this.storeService.coinsActionList
      .pipe(first((actionList) => !!(actionList && actionList.length)))
      .toPromise()
      .then((list) => {
        return list.find((al) => al.actionType === actionType);
      });
  }

  async saveActivity({
    actionType,
    data,
  }: {
    actionType: UserActionType;
    data: any;
  }) {
    const currentUser = this.storeService.loggedInUser.value;

    if (!currentUser) {
      return;
    }
    const rewardConditions = await this.getCoinInfoForAction({ actionType });
    const activity = {
      actionType,
      data,
      coinsRewarded: rewardConditions.coins,
    };
    this.syncUserActivity(activity);
    this.saveActivityInFirebase(activity);

    this.appService.showToast({
      message: this.storeService.json.pageConfig.value.coinActionsConfig.coinsEarnedToast.message.replace(
        /{{coinCount}}/g,
        rewardConditions.coins.toString()
      ),
      position: 'bottom',
      cssClass: ['type-1-toast'],
      duration: 3000,
      buttons: [
        {
          side: 'end',
          cssClass: 'type-1-toast-action-button',
          text: this.storeService.json.pageConfig.value.coinActionsConfig
            .coinsEarnedToast.actionButtonText,
          handler: () => {
            this.navController.navigateForward(PageRoutes.fullUrls.profile);
          },
        },
      ],
    });
  }

  async syncCoinCount() {
    const response = await this.requestService.send<GetCoinsApiResponse>(
      'GET',
      `${endpoints.getUserCoins}`
    );
    const { status, result } = response;
    const { code } = status;
    if (code !== 200) {
      return;
    }
    this.storeService.coinCounterStream.next({
      value: +result.type1.value,
      count: +result.type1.count,
      formattedCoinCount: this.appService.formatNumberWithCommas(
        +result.type1.count
      ),
    });
    return result;
  }

  checkIfProductViewed({
    itemId,
  }: {
    itemId: string;
  }): Observable<ProductViewClaimStatus> {
    return new Observable<ProductViewClaimStatus>((observer) => {
      if (
        itemId in
        this.storeService.coinClaimsTracker.productViewTracker.getValue()
      ) {
        observer.next(
          this.storeService.coinClaimsTracker.productViewTracker.getValue()[
            itemId
          ]
        );
      } else {
        this.checkIfProductViewedInFirebase({
          data: { itemId },
        }).then((claimed) => {
          observer.next({
            itemId,
            claimed,
          });
        });
      }
    });
  }

  checkIfReferralCodeClaimedInFirebase({ uid }: { uid: string }) {
    const actionType: UserActionType = 'referee_claimed';
    this.requestService
      .send<ReferralCodeClaimStatus>(
        'GET',
        `${this.storeService.coinFirebaseActivityUrl}/${actionType}/${uid}.json?shallow=true`
      )
      .then((res) => {
        this.storeService.coinClaimsTracker.referralCodeClaimTracker.next(res);
      });

    return this.storeService.coinClaimsTracker.referralCodeClaimTracker;
  }

  async getCoinActionList() {
    const response = await this.requestService.send<ICoinActionListApiResponse>(
      'GET',
      `${endpoints.getCoinActionList}`
    );

    this.storeService.coinsActionList.next(response.result);
  }
  private async checkIfProductViewedInFirebase({
    data,
  }: {
    data: { itemId: string };
  }) {
    const currentUser = this.storeService.loggedInUser.value;
    if (!currentUser) {
      return;
    }

    const actionType: UserActionType = 'product_view';
    return this.requestService.send<boolean>(
      'GET',
      `${this.storeService.coinFirebaseActivityUrl}/${actionType}/${currentUser.uid}/${data.itemId}.json?shallow=true`
    );
  }

  private async syncUserActivity(options: {
    actionType: UserActionType;
    data: any;
    coinsRewarded?: number;
  }) {
    const coinActivity: UserCoinActivity = {
      ...options,
    };
    const updateCoinActivityResponse = await this.requestService.send<ApiResponse>(
      'POST',
      `${endpoints.addCoinActivity}`,
      {
        body: { activityList: [coinActivity] },
      }
    );

    const { code } = updateCoinActivityResponse.status;
    if (code !== 200) {
      console.error('coin get error', status);
      return;
    }

    await this.syncCoinCount();
    return true;
  }

  private async clearTracker() {
    this.storeService.coinClaimsTracker.dailyLoginRewardTracker.next(null);
    this.storeService.coinClaimsTracker.productViewTracker.next({});
  }

  private async checkIfLoginRewardClaimedAlready() {
    const currentUser = this.storeService.loggedInUser.value;
    if (!currentUser) {
      return;
    }

    const actionType: UserActionType = 'daily_login_reward';
    return this.requestService.send<boolean>(
      'GET',
      `${this.storeService.coinFirebaseActivityUrl}/${actionType}/${
        currentUser.uid
      }/${this.appService.getFormattedDate(
        this.storeService.coinDailyLoginRewardDateFormat
      )}.json?shallow=true`
    );
  }

  // Only called once during init, after that number of gems should be given back by update activity api

  /**
   * Saves data in firebase
   *
   */
  private async saveActivityInFirebase(options: {
    actionType: UserActionType;
    data: any;
    coinsRewarded: number;
  }) {
    const currentUser = this.storeService.loggedInUser.value;

    if (!currentUser) {
      return;
    }

    const callFirebase = async (body: { [key: string]: any }) => {
      return this.requestService.send(
        'PATCH',
        `${this.storeService.coinFirebaseActivityUrl}/${actionType}/${currentUser.uid}/.json`,
        {
          body,
        }
      );
    };

    const { actionType, data } = options;

    if (actionType === 'product_view') {
      await callFirebase({
        [data.itemId]: true,
      });
      this.storeService.coinClaimsTracker.productViewTracker.next({
        ...this.storeService.coinClaimsTracker.productViewTracker.getValue(),
        [data.itemId]: {
          claimed: true,
          itemId: data.itemId,
        },
      });
    } else if (actionType === 'daily_login_reward') {
      const date = this.appService.getFormattedDate(
        this.storeService.coinDailyLoginRewardDateFormat
      );
      await callFirebase({
        [date]: true,
      });
      this.storeService.coinClaimsTracker.dailyLoginRewardTracker.next({
        claimed: true,
        date,
      });
    } else if (actionType === 'referee_claimed') {
      const { referralCode } = data || {};
      if (!referralCode) {
        return;
      }

      await callFirebase({
        [referralCode]: true,
      });
      this.storeService.coinClaimsTracker.referralCodeClaimTracker.next({
        claimed: true,
        referralCode,
      });
    } else if (actionType === 'share_product') {
      await callFirebase({ [data.itemId]: true });
    }
  }
}
