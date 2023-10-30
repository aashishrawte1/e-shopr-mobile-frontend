import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PageRoutes } from './constants';
import { RouteGuardService } from './services/route-guard.service';
import { AuthPageGuardService } from './services/auth-page-guard.service';
import { HomePageComponent } from './pages/home/home.page';

const rootRoutes: Routes = [
  {
    path: '',
    redirectTo: PageRoutes.fullUrls.home,
    pathMatch: 'full',
  },
  {
    path: PageRoutes.shortUrls.tabs,
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
    // canActivate: [RouteGuardService],
  },
  {
    path: `${PageRoutes.fullUrls.productDetail}`,
    loadChildren: () =>
      import('./pages/product-detail/product-detail.module').then(
        (m) => m.ProductDetailPageModule
      ),
    // canActivate: [RouteGuardService],
  },
  {
    path: PageRoutes.fullUrls.login,
    loadChildren: () =>
      import('./pages/auth-pages/login/login.module').then(
        (m) => m.LoginPageModule
      ),
  },
  {
    path: PageRoutes.fullUrls.register,
    loadChildren: () =>
      import('./pages/auth-pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: PageRoutes.fullUrls.checkout,
    loadChildren: () =>
      import('./pages/checkout/checkout.module').then(
        (m) => m.CheckoutPageModule
      ),
    canActivate: [RouteGuardService],
  },
  {
    path: PageRoutes.fullUrls.chat,
    loadChildren: () =>
      import('./pages/chat/chat.module').then((m) => m.ChatPageModule),
    canActivate: [RouteGuardService],
  },
  {
    path: PageRoutes.fullUrls.mixedContent,
    loadChildren: () =>
      import('./pages/mixed-content/mixed-content.module').then(
        (m) => m.MixedContentPageModule
      ),
  },
  {
    path: PageRoutes.fullUrls.shoppingCart,
    loadChildren: () =>
      import('./pages/shopping-cart/shopping-cart.module').then(
        (m) => m.ShoppingCartPageModule
      ),
    canActivate: [RouteGuardService],
  },
  {
    path: PageRoutes.fullUrls.orders,
    loadChildren: () =>
      import('./pages/orders/orders.module').then((m) => m.OrdersPageModule),
    canActivate: [RouteGuardService],
  },
  {
    path: PageRoutes.fullUrls.likes,
    loadChildren: () =>
      import('./pages/likes/likes.module').then((m) => m.LikesPageModule),
    canActivate: [RouteGuardService],
  },
  {
    path: PageRoutes.fullUrls.contactUs,
    loadChildren: () =>
      import('./pages/contact-us/contact-us.module').then(
        (m) => m.ContactUsPageModule
      ),
  },
  {
    path: PageRoutes.fullUrls.productSearch,
    loadChildren: () =>
      import('./pages/product-search/product-search.module').then(
        (m) => m.ProductSearchPageModule
      ),
  },
  {
    path: PageRoutes.fullUrls.privacyPolicy,
    loadChildren: () =>
      import('./pages/privacy-policy/privacy-policy.module').then(
        (m) => m.PrivacyPolicyPageModule
      ),
  },
  {
    path: PageRoutes.fullUrls.profile,
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [RouteGuardService],
  },
  {
    path: PageRoutes.fullUrls.help,
    loadChildren: () =>
      import('./pages/help/help.module').then((m) => m.HelpPageModule),
  },

  {
    path: PageRoutes.fullUrls.spinTheWheel,
    loadChildren: () =>
      import('./pages/playground/spin-the-wheel/spin-the-wheel.module').then(
        (m) => m.SpinTheWheelModule
      ),
  },
  {
    path: PageRoutes.fullUrls.searchResult,
    loadChildren: () =>
      import('./pages/search-result/search-result.module').then(
        (m) => m.SearchResultPageModule
      ),
  },
  {
    path: PageRoutes.fullUrls.credits,
    loadChildren: () =>
      import('./pages/credit/credit.module').then((m) => m.CreditsPageModule),
  },
  {
    path: PageRoutes.fullUrls.notification,
    loadChildren: () =>
      import('./pages/notification/notification.module').then(
        (m) => m.NotificationPageModule
      ),
    canActivate: [RouteGuardService],
  },
  {
    path: PageRoutes.fullUrls.registrationWelcomeQuizScreenHome,
    loadChildren: () =>
      import('./pages/welcome-quiz/welcome-quiz.module').then(
        (m) => m.WelcomeQuizPageModule
      ),
    canActivate: [RouteGuardService],
  },
  // ADD HOC PAGES
  {
    path: PageRoutes.fullUrls.passionWave,
    loadChildren: () =>
      import('./pages/ad-hoc-pages/passion-wave/passion-wave.module').then(
        (m) => m.PassionWavePageModule
      ),
  },

  // BARTERING
  {
    path: `${PageRoutes.fullUrls.barteringAddEditProduct}`,
    loadChildren: () =>
      import(
        './pages/bartering/bartering-modify-product/bartering-modify-product.module'
      ).then((m) => m.BarteringAddProductPageModule),
    canActivate: [RouteGuardService],
  },
  {
    path: `${PageRoutes.fullUrls.barteringProductDetail}`,
    loadChildren: () =>
      import(
        './pages/bartering/bartering-product-detail/bartering-product-detail.module'
      ).then((m) => m.BarteringProductDetailPageModule),
    canActivate: [RouteGuardService],
  },
  {
    path: `${PageRoutes.fullUrls.barteringMatches}`,
    loadChildren: () =>
      import(
        './pages/bartering/bartering-product-matches/bartering-product-matches.module'
      ).then((m) => m.BarteringProductMatchesPageModule),
    canActivate: [RouteGuardService],
  },
  {
    path: `${PageRoutes.fullUrls.barteringUserProductList}`,
    loadChildren: () =>
      import(
        './pages/bartering/bartering-user-products/bartering-user-products.module'
      ).then((m) => m.BarteringUserProductsPageModule),
    canActivate: [RouteGuardService],
  },
  {
    path: `${PageRoutes.fullUrls.barteringChatroom}`,
    loadChildren: () =>
      import(
        './pages/bartering/bartering-chatroom/bartering-chatroom.module'
      ).then((m) => m.BarteringChatBoxPageModule),
    canActivate: [RouteGuardService],
  },
  {
    path: `${PageRoutes.fullUrls.barteringChatList}`,
    loadChildren: () =>
      import(
        './pages/bartering/bartering-chatroom-list/bartering-chatroom-list.module'
      ).then((m) => m.BarteringChatRoomListPageModule),
    canActivate: [RouteGuardService],
  },
  // DEFAULT TO 404
  {
    path: '**',
    redirectTo: PageRoutes.fullUrls.home,
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(rootRoutes, {
      preloadingStrategy: PreloadAllModules,
      enableTracing: false,
      onSameUrlNavigation: 'reload',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
