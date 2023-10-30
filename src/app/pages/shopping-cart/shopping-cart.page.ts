import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CustomGoogleTagManagerService } from '../../services/custom-google-tag-manager.service';
import { filter } from 'rxjs/operators';
import { PageRoutes } from '../../constants';
import { IProductResult } from '../../models';
import { ShoppingCartPageData } from '../../models/app-data.model';
import { CostMap } from '../../models/CostMap.interface';
import { gtmEventNames } from '../../models/gtm-event.model';
import { IMerchantStore } from '../../models/MerchantStore.interface';
import { AppConfigService } from '../../services/app-config.service';
import { AppService } from '../../services/app.service';
import { ProductFetcherService } from '../../services/product-fetcher.service';
import { RoutingStateService } from '../../services/routing-state.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { StaticAssetService } from '../../services/static-asset.service';
import { StoreService } from '../../services/store.service';
import PageObserverComponent from '../../utils/component-observer.util';

@Component({
  selector: 'user-portal-shopping-cart',
  templateUrl: './shopping-cart.page.html',
  styleUrls: ['./shopping-cart.page.scss'],
})
export class ShoppingCartPageComponent
  extends PageObserverComponent
  implements OnInit {
  popularProducts: IProductResult[];
  shoppingCart: IMerchantStore;
  subtotal: number;
  costMapForStores: CostMap;
  cartEmpty: boolean;
  pageConfig: ShoppingCartPageData;

  constructor(
    public storeService: StoreService,
    private navController: NavController,
    public assetService: StaticAssetService,
    private cdr: ChangeDetectorRef,
    private shoppingCartService: ShoppingCartService,
    private productService: ProductFetcherService,
    private appConfigService: AppConfigService,
    private appService: AppService,
    private routingStateService: RoutingStateService,
    private gtmService: CustomGoogleTagManagerService
  ) {
    super();
  }

  async doRefresh(event: any) {
    await this.shoppingCartService.fetchMyShoppingCart();
    event.target.complete();
  }
  ngOnInit() {
    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.shoppingCartPage;
      this.cdr.detectChanges();
    });
    this.observe(this.storeService.shoppingCart, async (shoppingCart) => {
      this.shoppingCart = shoppingCart;
      if (this.shoppingCart) {
        this.costMapForStores = await this.shoppingCartService.getCostMapForCart(
          this.shoppingCart
        );
        this.subtotal = Object.values(this.costMapForStores).reduce(
          (accumulator, item) => accumulator + item.subtotal,
          0
        );
      }

      this.cdr.detectChanges();
    });

    this.subscribeToRouteChange();
  }

  async subscribeToRouteChange() {
    this.observe(
      this.routingStateService.currentRoute.pipe(
        filter(({ url }) => !!url?.includes(PageRoutes.fullUrls.shoppingCart))
      ),
      async (_) => {
        this.shoppingCartService.fetchMyShoppingCart();
        this.fetchPopularProducts();
      }
    );
  }

  fetchPopularProducts() {
    const initialRange = this.appService.getInitialRange({
      incrementBy: this.appConfigService.constants
        .shoppingCartRecommendedProductsCount,
    });

    this.productService
      .fetchProducts({
        type: 'forPopular',
        query: {
          start: initialRange.current.start,
          end: initialRange.current.end,
          tags: this.appService.getCommaSeparatedTags(
            this.appConfigService.constants.marketPopularProductsAssociatedTags
          ),
        },
      })
      .then(({ result }) => {
        this.popularProducts = result;
        this.cdr.detectChanges();
      });
  }

  async checkout() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.cartPageCheckoutButtonClick,
        products: this.shoppingCartService.getCartItemDetailsWithIdAndCount(
          this.storeService.shoppingCart.getValue()
        ),
      });
    } catch (error) {}
    this.navController.navigateForward(PageRoutes.fullUrls.checkout);
  }

  shopNow() {
    this.navController.navigateBack(PageRoutes.fullUrls.market);
  }

  goBack() {
    this.navController.back();
  }

  goToLikesListPage() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.cartPageHeaderLikeIconClick,
      });
    } catch (error) {}
    this.navController.navigateForward(PageRoutes.fullUrls.likes);
  }

  onYouMayAlsoLikeItemClick(product: IProductResult) {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.cartPageYouMayAlsoLikeItemClick,
        productTitle: product.title,
        productId: product.uniqueId,
      });
    } catch (error) {}
  }
}
