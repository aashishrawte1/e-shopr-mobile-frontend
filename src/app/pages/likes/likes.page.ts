import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { NavController } from '@ionic/angular';
import { CustomGoogleTagManagerService } from '../../services/custom-google-tag-manager.service';
import { PageRoutes } from '../../constants';
import { IProductResult } from '../../models';
import { LikesPageData } from '../../models/app-data.model';
import { gtmEventNames } from '../../models/gtm-event.model';
import { ProductFetcherService } from '../../services/product-fetcher.service';
import { StaticAssetService } from '../../services/static-asset.service';
import { StoreService } from '../../services/store.service';
import PageObserverComponent from '../../utils/component-observer.util';

@Component({
  selector: 'user-portal-likes',
  templateUrl: './likes.page.html',
  styleUrls: ['./likes.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LikesPageComponent extends PageObserverComponent {
  likedItems: IProductResult[];
  pageConfig: LikesPageData;

  constructor(
    private cdr: ChangeDetectorRef,
    private navController: NavController,
    public asset: StaticAssetService,
    private productService: ProductFetcherService,
    public storeService: StoreService,
    private gtmService: CustomGoogleTagManagerService
  ) {
    super();
  }
  async doRefresh(event: any) {
    await this.productService.getLikedProducts();
    event.target.complete();
  }

  async ionViewWillEnter() {
    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.likesPage;
      this.cdr.detectChanges();
    });

    this.likedItems = (await this.productService.getLikedProducts()) || [];
    this.cdr.detectChanges();
  }

  shopNow() {
    this.navController.navigateBack(PageRoutes.fullUrls.market);
  }

  goBack() {
    this.navController.back();
  }

  onProductItemClick(product: IProductResult) {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.likedItemsPageProductClick,
        productTitle: product.title,
        productId: product.uniqueId,
      });
    } catch (error) {}
  }
}
