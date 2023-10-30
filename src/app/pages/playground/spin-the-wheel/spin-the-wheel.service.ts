import { Injectable } from '@angular/core';
import { AppService } from '../../../services/app.service';
import { StoreService } from '../../../services/store.service';
import { SpinWheelReward } from './wheel-reward.interface';

@Injectable({
  providedIn: 'root',
})
export class SpinTheWheelService {
  constructor(
    private appService: AppService,
    private storeService: StoreService
  ) {}

  async saveSpinReward(reward: SpinWheelReward) {
    let data = await this.storeService.wheelSpin.getValue();

    const today = this.appService.getFormattedDate();
    if (!data || data.date !== today) {
      data = {
        date: this.appService.getFormattedDate(),
        spinCount: 20,
        rewards: [],
      };
    }

    data.spinCount -= 1;
    data.rewards.push(reward);
    this.storeService.wheelSpin.next(data);
  }
}
