import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { first, map } from 'rxjs/operators';
import { PageRoutes } from '../../../constants';
import { StaticAssetService } from '../../../services/static-asset.service';
import { StoreService } from '../../../services/store.service';
import PageObserverComponent from '../../../utils/component-observer.util';
import { BarteringChatService } from '../bartering-chat.service';
import { IBarteringProductItem } from '../bartering.model';
import { BarteringService } from '../bartering.service';

@Component({
  selector: 'user-portal-product-matches-bartering',
  templateUrl: './bartering-product-matches.page.html',
  styleUrls: ['./bartering-product-matches.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductMatchesBarteringPageComponent
  extends PageObserverComponent
  implements OnInit {
  productsByUser: IBarteringProductItem[] = [];
  userSelectedProductId: string;
  matchedProducts: IBarteringProductItem[] = [];
  constructor(
    private cdr: ChangeDetectorRef,
    private barteringChatService: BarteringChatService,
    public assetService: StaticAssetService,
    private barteringService: BarteringService,
    private navController: NavController,
    private storeService: StoreService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }
  doRefresh(event: any) {
    event.target.complete();
    this.cdr.detectChanges();
  }

  async ngOnInit() {
    this.observe(
      this.activatedRoute.queryParamMap.pipe(
        first((val: any) => !!val),
        map((val) => val.params)
      ),
      async (params) => {
        const { selectedProductId } = params || {};
        if (!selectedProductId) {
          return;
        }

        const productsByUser = await this.storeService.barteringProductByUser
          .pipe(first((products) => !!(products && products.length)))
          .toPromise();

        this.productsByUser = [
          productsByUser.find((p) => p.productId === selectedProductId),
        ];

        this.selectProductByUser(this.productsByUser[0]);
        this.cdr.detectChanges();
      }
    );

    this.observe(this.storeService.matchedProducts, async (matchedProducts) => {
      this.matchedProducts = (matchedProducts || {})[
        this.userSelectedProductId
      ];
      this.cdr.detectChanges();
    });
  }

  gotoProductDetail(productId: string) {
    this.navController.navigateForward(
      `${
        PageRoutes.fullUrls.barteringProductDetail
      }?targetProductId=${productId}&sourceProductId=${
        this.userSelectedProductId
      }&sourceProductImage=${
        this.getSelectedProduct(this.userSelectedProductId).images[0]
      }`
    );
  }

  getSelectedProduct(productId: string) {
    return this.productsByUser.find((p) => p.productId === productId);
  }

  async selectProductByUser(product: IBarteringProductItem) {
    if (this.userSelectedProductId === product.productId) {
      return;
    }

    this.userSelectedProductId = product.productId;
    for (const item of this.productsByUser) {
      product.selected = false;
      if (item.productId === this.userSelectedProductId) {
        product.selected = true;
      }
    }
    this.barteringService.getMatchesForCurrentSelectedProduct({
      sourceProductId: this.userSelectedProductId,
    });
    this.cdr.detectChanges();
  }
  goBack() {
    this.navController.back();
  }

  async removeMatch(product: IBarteringProductItem) {
    const { status } = await this.barteringService.updateProductLikedByUser({
      sourceProductId: this.userSelectedProductId,
      targetProductId: product?.productId,
    });
    if (status.code !== 200) {
      return;
    }
    await this.barteringService.getMatchesForCurrentSelectedProduct({
      sourceProductId: this.userSelectedProductId,
    });
  }

  chatWithUser(product: IBarteringProductItem) {
    const sortedProductIds = [
      this.userSelectedProductId,
      product.productId,
    ].sort();
    const room = this.storeService.barteringChatRoomList.value?.find(
      (roomInfo) => roomInfo.allProductIds === sortedProductIds.join(',')
    );

    if (!room) {
      this.barteringChatService.sendMessage({
        productIds: sortedProductIds,
        message: `I'm interested.`,
      });
    }

    this.navController.navigateForward(
      `${PageRoutes.fullUrls.barteringChatroom}?productIds=${this.userSelectedProductId},${product.productId}`
    );
  }
}
