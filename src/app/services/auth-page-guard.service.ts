import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PageRoutes } from '../constants';
import { ApiService } from './api.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class AuthPageGuardService {
  constructor(
    private storeService: StoreService,
    private navController: NavController,
    private apiService: ApiService
  ) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url = state.url;
    const fbUser = await this.storeService.authFirebaseUser.getValue();
    const currentUser = this.storeService.loggedInUser.getValue();
    if (!!fbUser) {
      if (!!currentUser) {
        return false;
      }

      const dbUser = await this.apiService.fetchMyProfile({
        uid: currentUser.uid,
      });
      this.storeService.loggedInUser.next(dbUser?.result);
    }
    return true;
  }
}
