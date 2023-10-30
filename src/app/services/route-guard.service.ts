import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { NavController } from '@ionic/angular';
import { PageRoutes } from '../constants';
import { StoreService } from './store.service';

@Injectable({ providedIn: 'root' })
export class RouteGuardService implements CanActivate {
  constructor(
    private navController: NavController,
    private storeService: StoreService
  ) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url = state.url;
    const currentUser = await this.storeService.authFirebaseUser.getValue();
    console.log('CAN ACTIVATE', { url, currentUser });
    // if user is there, and the route is auth route, then go back to page that is non-auth
    if (!!currentUser) {
      return true;
    } else {
    }
    this.navController.navigateRoot(PageRoutes.fullUrls.login);
    return false;
  }
}
