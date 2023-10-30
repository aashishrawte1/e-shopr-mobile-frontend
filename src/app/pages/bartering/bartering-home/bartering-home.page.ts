import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { NavController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { PageRoutes } from '../../../constants';
import { IBarteringProductItem } from '../../../models';
import { gtmEventNames } from '../../../models/gtm-event.model';
import { AppService } from '../../../services/app.service';
import { CustomGoogleTagManagerService } from '../../../services/custom-google-tag-manager.service';
import { RoutingStateService } from '../../../services/routing-state.service';
import { StaticAssetService } from '../../../services/static-asset.service';
import { StoreService } from '../../../services/store.service';
import PageObserverComponent from '../../../utils/component-observer.util';
import { sleep } from '../../../utils/sleep.util';
import { BarteringService } from '../bartering.service';

@Component({
  selector: 'user-portal-bartering-home',
  templateUrl: './bartering-home.page.html',
  styleUrls: ['./bartering-home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarteringHomePageComponent
  extends PageObserverComponent
  implements OnInit {
  productsByUser: IBarteringProductItem[] = [];
  matchesProductsForUser: IBarteringProductItem[] = [];
  relevantProducts: IBarteringProductItem[] = [];
  userSelectedProductId: string;

  constructor(
    private cdr: ChangeDetectorRef,
    public assetService: StaticAssetService,
    private barteringService: BarteringService,
    private navController: NavController,
    private appService: AppService,
    public storeService: StoreService,
    private routingStateService: RoutingStateService,
    private gtmService: CustomGoogleTagManagerService
  ) {
    super();
  }
  async doRefresh(event: any) {
    this.barteringService.getAllProductsPostedByUser();
    this.refreshData();
    sleep(500);
    event.target.complete();
    this.cdr.detectChanges();
  }

  async ngOnInit() {
    const spinner = await this.appService.showSpinner({
      message: 'loading...',
    });

    this.observe(
      this.routingStateService.currentRoute.pipe(
        filter(({ url }) => !!url?.includes(PageRoutes.fullUrls.barteringHome))
      ),
      async (_) => {
        if (!this.userSelectedProductId) {
          return;
        }
        this.refreshData();
      }
    );

    this.observe(
      this.storeService.barteringProductByUser,
      async (barteringProductByUser) => {
        await spinner.dismiss();
        this.productsByUser = barteringProductByUser;
        if (this.productsByUser?.length) {
          const userSelectedProductId =
            this.userSelectedProductId || this.productsByUser[0].productId;

          this.selectProductByUser(
            this.productsByUser.find(
              (pbu) => pbu.productId === userSelectedProductId
            ) || this.productsByUser[0]
          );
        }
        this.cdr.detectChanges();
      }
    );

    this.observe(this.storeService.matchedProducts, async (matchedProducts) => {
      this.matchesProductsForUser = (matchedProducts || {})[
        this.userSelectedProductId
      ];
      this.cdr.detectChanges();
    });

    this.observe(
      this.storeService.relevantProductsMap,
      async (relevantProductsMap) => {
        this.relevantProducts = (relevantProductsMap || {})[
          this.userSelectedProductId
        ];
        this.cdr.detectChanges();
      }
    );
  }

  gotoToAddProductPage() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.barteringHomeAddItemClick,
      });
    } catch (error) {}
    this.navController.navigateForward(
      PageRoutes.fullUrls.barteringAddEditProduct
    );
  }
  gotoToMatchesPage() {
    this.navController.navigateForward(
      `${PageRoutes.fullUrls.barteringMatches}?selectedProductId=${this.userSelectedProductId}`
    );
  }

  viewDetailForRelevantProduct(product: IBarteringProductItem) {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.barteringHomePageOthersProductClick,
        productId: product.productId,
        productTitle: product.title,
      });
    } catch (error) {}
    this.barteringService.goToProductDetailPage({
      sourceProductId: this.userSelectedProductId,
      targetProductId: product.productId,
      sourceProductImage: this.getSelectedProduct(this.userSelectedProductId)
        .images[0],
    });
  }
  async selectProductByUser(product: IBarteringProductItem) {
    if (this.userSelectedProductId === product.productId) {
      return;
    }
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.barteringHomePageOwnProductCircleClick,
        productId: product.productId,
        productTitle: product.title,
      });
    } catch (error) {}
    this.userSelectedProductId = product.productId;
    for (const item of this.productsByUser) {
      product.selected = false;
      if (item.productId === this.userSelectedProductId) {
        product.selected = true;
      }
    }
    this.refreshData();
    this.cdr.detectChanges();
  }

  refreshData() {
    this.barteringService.getRelevantProductsForCurrentSelectedProduct({
      selectedProductId: this.userSelectedProductId,
    });

    this.barteringService.getMatchesForCurrentSelectedProduct({
      sourceProductId: this.userSelectedProductId,
    });
  }

  goBack() {
    this.navController.navigateRoot(PageRoutes.fullUrls.home);
  }

  viewMyProductList() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.barteringHomeEditButtonClick,
      });
    } catch (error) {}
    this.navController.navigateForward(
      PageRoutes.fullUrls.barteringUserProductList
    );
  }

  viewChatList() {
    this.navController.navigateForward(PageRoutes.fullUrls.barteringChatList);
  }

  getSelectedProduct(productId: string) {
    return this.productsByUser.find((p) => p.productId === productId);
  }
}
