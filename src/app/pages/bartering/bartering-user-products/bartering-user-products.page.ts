import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { NavController } from '@ionic/angular';
import { PageRoutes } from '../../../constants';
import { IBarteringProductItem } from '../../../models';
import { AppService } from '../../../services/app.service';
import { StaticAssetService } from '../../../services/static-asset.service';
import { StoreService } from '../../../services/store.service';
import PageObserverComponent from '../../../utils/component-observer.util';
import { IChatType } from '../../chat/chat.page';
import { BarteringService } from '../bartering.service';

@Component({
  selector: 'user-portal-bartering-user-products',
  templateUrl: './bartering-user-products.page.html',
  styleUrls: ['./bartering-user-products.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarteringUserProductsPageComponent
  extends PageObserverComponent
  implements OnInit {
  productsByUser: IBarteringProductItem[] = [];
  matchesProductsForUser: IBarteringProductItem[] = [];
  selectedProductId: string;
  constructor(
    private cdr: ChangeDetectorRef,
    public assetService: StaticAssetService,
    private barteringService: BarteringService,
    private navController: NavController,
    private storeService: StoreService,
    private appService: AppService
  ) {
    super();
  }
  async doRefresh(event: any) {
    await this.barteringService.getAllProductsPostedByUser();
    event.target.complete();
    this.cdr.detectChanges();
  }

  async ngOnInit() {
    this.observe(
      this.storeService.barteringProductByUser,
      async (barteringProductByUser) => {
        this.productsByUser = barteringProductByUser;
        this.cdr.detectChanges();
      }
    );
  }

  async editSelectedUserProduct(productId: string) {
    await this.appService.showSpinner({
      message: 'loading...',
    });

    this.navController.navigateForward(
      `${PageRoutes.fullUrls.barteringAddEditProduct}?productId=${productId}`
    );
  }

  goBack() {
    this.navController.back();
  }

  onAddProductClick() {
    this.navController.navigateForward(
      PageRoutes.fullUrls.barteringAddEditProduct
    );
  }
}
