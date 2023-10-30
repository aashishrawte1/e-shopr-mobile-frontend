import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NavController } from '@ionic/angular';
import { PageRoutes } from '../../constants';
import { ActiveFilterItem, ICartItem } from '../../models';
import { CostMap } from '../../models/CostMap.interface';
import {
  IGetMerchantsResponse,
  IMerchantInfo,
} from '../../models/IMerchantResult';
import { IMerchantStore } from '../../models/MerchantStore.interface';
import { AppService } from '../../services/app.service';
import { ProductFetcherService } from '../../services/product-fetcher.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { StaticAssetService } from '../../services/static-asset.service';
import { StoreService } from '../../services/store.service';
import { UserProfileService } from '../../services/user-profile.service';
import PageObserverComponent from '../../utils/component-observer.util';

@Component({
  selector: 'user-portal-cart-items-summary',
  templateUrl: './cart-items-summary.component.html',
  styleUrls: ['./cart-items-summary.component.scss'],
})
export class CartItemsSummaryComponent
  extends PageObserverComponent
  implements OnInit, OnChanges {
  @Input() shoppingCart: IMerchantStore;
  @Input() options: {
    showShippingCost: boolean;
    allowCountEdit: boolean;
    showNoteToSellerInput: boolean;
    editableNote: boolean;
  };
  keys = Object.keys;
  costMap: CostMap = {};
  constructor(
    private cart: ShoppingCartService,
    private cdr: ChangeDetectorRef,
    public asset: StaticAssetService,
    public storeService: StoreService,
    private shoppingCartService: ShoppingCartService,
    private productService: ProductFetcherService,
    public userService: UserProfileService,
    private navController: NavController,
    private appService: AppService
  ) {
    super();
  }

  async ngOnInit() {}

  async ngOnChanges(changes: SimpleChanges) {
    if (
      changes.shoppingCart.currentValue !== changes.shoppingCart.previousValue
    ) {
      this.shoppingCart = changes.shoppingCart.currentValue;
      this.costMap = await this.shoppingCartService.getCostMapForCart(
        this.shoppingCart
      );
    }
    this.cdr.detectChanges();
  }

  async increase(merchantId: string, item: ICartItem) {
    await this.cart.addItem({ merchantId, item });
  }

  async decrease(merchantId: string, item: ICartItem) {
    await this.cart.removeItem({ merchantId, item });
  }

  async onNoteToSellerChange(
    note: EventTarget,
    merchantId: string,
    item: ICartItem
  ) {
    this.shoppingCart[merchantId][
      item.uniqueId
    ].noteToSeller = (note as any).value;
    this.storeService.shoppingCart.next(this.shoppingCart);
  }
  goToDetailPage(product: any) {
    this.productService.goToProductDetailPage({ product });
  }

  async goToMarketPageWithMerchantSelected({
    cartItem,
  }: {
    cartItem: ICartItem;
  }) {
    const dataForMarket: Partial<ActiveFilterItem> = {};
    dataForMarket.type = 'merchant';
    dataForMarket.id = cartItem.owner;
    dataForMarket.selected = true;
    dataForMarket.text = cartItem.ownerName;

    this.navController.navigateBack(PageRoutes.fullUrls.market, {
      state: {
        activeFilter: dataForMarket,
      },
      replaceUrl: true,
    });
  }
}
