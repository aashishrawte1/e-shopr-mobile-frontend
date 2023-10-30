import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { NavController } from '@ionic/angular';
import { CustomGoogleTagManagerService } from '../../services/custom-google-tag-manager.service';
import { format, parseISO } from 'date-fns';
import { PageRoutes } from '../../constants';
import { IProductResult } from '../../models';
import { OrdersPageData } from '../../models/app-data.model';
import { CostMap } from '../../models/CostMap.interface';
import { gtmEventNames } from '../../models/gtm-event.model';
import { IOrderResult } from '../../models/IGetOrdersResponse';
import { AppConfigService } from '../../services/app-config.service';
import { AppService } from '../../services/app.service';
import { PaymentService } from '../../services/payment.service';
import { ProductFetcherService } from '../../services/product-fetcher.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { StaticAssetService } from '../../services/static-asset.service';
import { StoreService } from '../../services/store.service';
import PageObserverComponent from '../../utils/component-observer.util';
import { useSubject } from '../../utils/useSubject';

@Component({
  selector: 'user-portal-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPageComponent extends PageObserverComponent {
  orderList: IOrderResult[];
  _productDescription: string;
  _productTitle: string;
  popularProducts: IProductResult[];
  costMapForStores: CostMap;
  readonly orderDisplayTimeFormat = 'dd MMMM yyyy hh:mm aa';
  pageConfig: OrdersPageData;

  constructor(
    public storeService: StoreService,
    private appService: AppService,
    private cdr: ChangeDetectorRef,
    private navController: NavController,
    public asset: StaticAssetService,
    private paymentService: PaymentService,
    private productService: ProductFetcherService,
    private shoppingCartService: ShoppingCartService,
    private appConfigService: AppConfigService,
    private gtmService: CustomGoogleTagManagerService
  ) {
    super();
  }
  async doRefresh(event: any) {
    await this.paymentService.getMyOrders();
    event.target.complete();
  }
  async ionViewWillEnter() {
    const message = useSubject<string>('Please wait...');
    await this.appService.showLoader(
      { backdropDismiss: false, showBackdrop: true, duration: 1000 },
      message
    );

    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.ordersPage;
      this.cdr.detectChanges();
    });

    await this.paymentService.getMyOrders();
    message.next('Getting Order List...');

    this.observe(this.storeService.myOrders, async (myOrders) => {
      myOrders = myOrders.sort((a, b) => {
        return +new Date(b.ordered_at) - +new Date(a.ordered_at);
      });

      for (const order of myOrders) {
        this.costMapForStores = await this.shoppingCartService.getCostMapForCart(
          order.products
        );
        order.finalCost = {
          subtotal: Object.values(this.costMapForStores).reduce(
            (accumulator, item) => accumulator + item.subtotal,
            0
          ),
          total: Object.values(this.costMapForStores).reduce(
            (accumulator, item) => accumulator + item.total,
            0
          ),
          shipping: Object.values(this.costMapForStores).reduce(
            (accumulator, item) => accumulator + item.shipping,
            0
          ),
        };
      }

      this.orderList = myOrders;
      this.cdr.detectChanges();
    });

    const initialRange = this.appService.getInitialRange({
      incrementBy: this.appConfigService.constants
        .marketNumberOfItemsToFetchAtOnce,
    });
    this.productService
      .fetchProducts({
        type: 'forPopular',
        query: {
          tags: this.appService.getCommaSeparatedTags(
            this.appConfigService.constants.marketPopularProductsAssociatedTags
          ),
          start: initialRange.current.start,
          end: initialRange.current.end,
        },
      })
      .then(({ result }) => {
        this.popularProducts = result;
        this.cdr.detectChanges();
      });
  }

  getTime(time: string) {
    return format(parseISO(time), this.orderDisplayTimeFormat);
  }
  shopNow() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.ordersPageShopNowClick,
      });
    } catch (error) {}
    this.navController.navigateBack(PageRoutes.fullUrls.market);
  }
  goBack() {
    this.navController.navigateBack(PageRoutes.fullUrls.market);
  }
}
