import { Injectable } from '@angular/core';
import { filter, first } from 'rxjs/operators';
import { endpoints } from '../constants/endpoints';
import { ApiResponse } from '../models';
import { IReferralCodeApiResponse } from '../models/referral-code.model';
import { CoinService } from './coin.service';
import { RequestService } from './request.service';
import { StoreService } from './store.service';
@Injectable({
  providedIn: 'root',
})
export class ReferralCodeService {
  constructor(
    private storeService: StoreService,
    private requestService: RequestService,
    public coinService: CoinService
  ) {}
  async init() {}

  get referralCode() {
    this.storeService.loggedInUser
      .pipe(first((val) => !!val))
      .subscribe(async (currentUser) => {
        if (!this.storeService.userReferralCode.getValue()) {
          const referralCode = (await this.getUserReferralCode())?.referralCode;
          this.storeService.userReferralCode.next(referralCode);
          this.coinService
            .checkIfReferralCodeClaimedInFirebase({ uid: currentUser?.uid })
            .subscribe((claimStatus) => {
              this.storeService.referralCodeClaimStatus.next(claimStatus);
            });
        }
      });
    return this.storeService.userReferralCode.pipe(filter((val) => !!val));
  }

  async getUserReferralCode() {
    const response = await this.requestService.send<IReferralCodeApiResponse>(
      'GET',
      `${endpoints.getUserReferralCode}`
    );

    return response.result;
  }

  async checkIfReferralCodeIsValid({ referralCode }: { referralCode: string }) {
    return this.requestService.send<ApiResponse>(
      'POST',
      `${endpoints.checkReferralCodeValidity}`,
      {
        body: {
          referralCode,
        },
      }
    );
  }
}
