import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageRoutes } from '../../constants';
import { RouteGuardService } from '../../services/route-guard.service';
import { TabsPageComponent } from './tabs.page';
const routes: Routes = [
  {
    path: '',
    component: TabsPageComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: PageRoutes.fullUrls.home,
      },
      {
        path: PageRoutes.shortUrls.home,
        loadChildren: () =>
          import('../home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: PageRoutes.shortUrls.market,
        loadChildren: () =>
          import('../market/market.module').then((m) => m.MarketPageModule),
      },
      {
        path: PageRoutes.shortUrls.barteringRoot,
        loadChildren: () =>
          import('../bartering/bartering-home/bartering-home.module').then(
            (m) => m.BarteringHomePageModule
          ),
        canActivate: [RouteGuardService],
      },
      {
        path: PageRoutes.shortUrls.community,
        loadChildren: () =>
          import('../community/community.module').then(
            (m) => m.CommunityPageModule
          ),
      },
      {
        path: PageRoutes.shortUrls.shoppingCart,
        loadChildren: () =>
          import('../shopping-cart/shopping-cart.module').then(
            (m) => m.ShoppingCartPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
