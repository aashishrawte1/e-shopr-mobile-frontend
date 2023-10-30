import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { NavController } from '@ionic/angular';
import { filter, first, map } from 'rxjs/operators';
import { PageRoutes } from '../../../constants';
import { IBarteringProductItem } from '../../../models';
import { RoutingStateService } from '../../../services/routing-state.service';
import { StaticAssetService } from '../../../services/static-asset.service';
import { StoreService } from '../../../services/store.service';
import PageObserverComponent from '../../../utils/component-observer.util';
import { getYouTubeVideoId } from '../../../utils/get-youtube-video-id.util';
import { BarteringService } from '../bartering.service';
type TImageShowStatus = Array<{
  [key: string]: boolean;
}>;
interface IDisplayImageTracker {
  productId: string;
  imagesShowStatus: TImageShowStatus;
}
@Component({
  selector: 'user-portal-product-detail-bartering',
  templateUrl: './bartering-product-detail.page.html',
  styleUrls: ['./bartering-product-detail.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailBarteringPageComponent
  extends PageObserverComponent
  implements OnInit, OnDestroy {
  product: IBarteringProductItem;
  sourceProductId: string;
  displayedImageTracker: IDisplayImageTracker;
  icons: {
    heartIcon: {
      filled: string;
      unFilled: string;
    };
  } = {
    heartIcon: {
      filled:
        'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/icons/heart/heart-filled.svg',
      unFilled:
        'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/icons/heart/heart-unfilled.svg',
    },
  };
  targetProductId: string;
  sourceProductImage: string;
  constructor(
    public assetService: StaticAssetService,
    private barteringService: BarteringService,
    private navController: NavController,
    private cdr: ChangeDetectorRef,
    private photoViewer: PhotoViewer,
    private routingStateService: RoutingStateService,
    private storeService: StoreService,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }

  async doRefresh(event: any) {
    this.product = await this.barteringService.fetchProductDetailWithRelevance({
      sourceProductId: this.sourceProductId,
      targetProductId: this.targetProductId,
    });
    event.target.complete();
  }

  async ngOnInit() {
    // First Time
    this.observe(
      this.activatedRoute.queryParamMap.pipe(
        first((val: any) => !!val),
        map((val) => val.params)
      ),
      async ({ sourceProductId, targetProductId, sourceProductImage }) => {
        this.loadPageData({
          sourceProductId,
          targetProductId,
          sourceProductImage,
        });
      }
    );
    this.subscribeToRouteChange();
  }

  subscribeToRouteChange() {
    this.observe(
      this.routingStateService.currentRoute.pipe(
        filter(({ url }) =>
          url.includes(PageRoutes.fullUrls.barteringProductDetail)
        )
      ),
      async ({ params }) => {
        this.loadPageData(params as any);
      }
    );
  }

  async loadPageData({
    sourceProductId,
    targetProductId,
    sourceProductImage,
  }: {
    sourceProductId: string;
    targetProductId: string;
    sourceProductImage: string;
  }) {
    this.product = null;
    if (!(sourceProductId && targetProductId)) {
      return;
    }

    this.sourceProductImage = sourceProductImage;
    this.sourceProductId = sourceProductId;
    this.targetProductId = targetProductId;
    this.product = this.getProductDetailFromRelevantList({
      sourceProductId,
      targetProductId,
    });

    if (this.product) {
      this.displayedImageTracker = this.getInitialImageDisplayTracker({
        product: this.product,
      });
    }

    this.cdr.detectChanges();
    this.product = await this.barteringService.fetchProductDetailWithRelevance({
      sourceProductId,
      targetProductId,
    });
    this.displayedImageTracker = this.getInitialImageDisplayTracker({
      product: this.product,
    });
    this.cdr.detectChanges();
  }

  getInitialImageDisplayTracker({
    product,
  }: {
    product: IBarteringProductItem;
  }) {
    const imagesShowStatus = {} as TImageShowStatus;
    for (const imgLink of product.images) {
      imagesShowStatus[imgLink] = false;
    }

    imagesShowStatus[product.images[0]] = true;
    return {
      productId: product.productId,
      imagesShowStatus,
    };
  }

  async onLikeButtonClick() {
    this.product.statistics.currentUser.liked = !this.product.statistics
      .currentUser.liked;
    this.cdr.detectChanges();
    const { status } = await this.barteringService.updateProductLikedByUser({
      sourceProductId: this.sourceProductId,
      targetProductId: this.targetProductId,
    });
    if (status.code !== 200) {
      return;
    }

    // like this product if list is present. especially useful when app is reloaded on this page.
    if (
      this.checkRelevantProductListPresence({
        sourceProductId: this.sourceProductId,
      })
    ) {
      // set like in store
      this.storeService.relevantProductsMap.value[this.sourceProductId].find(
        (rpm) => rpm.productId === this.targetProductId
      ).statistics.currentUser.liked = this.product.statistics.currentUser.liked;
    }
  }

  goBack() {
    if (
      !!this.checkRelevantProductListPresence({
        sourceProductId: this.sourceProductId,
      })
    ) {
      this.storeService.relevantProductsMap.value[
        this.sourceProductId
      ] = this.storeService.relevantProductsMap.value[this.sourceProductId].map(
        (vl) => {
          vl.statistics.currentUser.skipped = false;
          return vl;
        }
      );
    }
    this.navController.navigateRoot(PageRoutes.fullUrls.barteringHome);
  }

  getYouTubeVideoId(url: string) {
    return getYouTubeVideoId(url);
  }

  openViewer(imageLink: string) {
    this.photoViewer.show(imageLink);
  }

  onNextProductButtonClick() {
    // mark current item as skipped
    if (
      this.checkRelevantProductListPresence({
        sourceProductId: this.sourceProductId,
      })
    ) {
      // mark item as skipped;
      this.storeService.relevantProductsMap.value[this.sourceProductId].find(
        (rpm) => rpm.productId === this.targetProductId
      ).statistics.currentUser.skipped = true;
    }
    const nextProductId = this.getNextProductInSequence({
      sourceProductId: this.sourceProductId,
    });

    if (!nextProductId) {
      this.goBack();
      return;
    }

    this.barteringService.goToProductDetailPage({
      sourceProductId: this.sourceProductId,
      targetProductId: nextProductId,
      sourceProductImage: this.sourceProductImage,
    });
  }

  getNextProductInSequence({ sourceProductId }: { sourceProductId: string }) {
    if (!this.checkRelevantProductListPresence({ sourceProductId })) {
      return;
    }
    return this.storeService.relevantProductsMap.value[sourceProductId].find(
      (r) =>
        !r.statistics.currentUser.liked && !r.statistics.currentUser.skipped
    )?.productId;
  }

  checkRelevantProductListPresence({
    sourceProductId,
  }: {
    sourceProductId: string;
  }) {
    return !!(
      this.storeService.relevantProductsMap.value &&
      this.storeService.relevantProductsMap.value[sourceProductId]?.length
    );
  }

  getProductDetailFromRelevantList({
    sourceProductId,
    targetProductId,
  }: {
    sourceProductId: string;
    targetProductId: string;
  }) {
    if (!this.checkRelevantProductListPresence({ sourceProductId })) {
      return;
    }
    return this.storeService.relevantProductsMap.value[sourceProductId].find(
      (p) => p.productId === targetProductId
    );
  }

  async goToSlide(link: string) {
    for (const key of Object.keys(
      this.displayedImageTracker.imagesShowStatus
    )) {
      this.displayedImageTracker.imagesShowStatus[key] = false;
    }
    this.displayedImageTracker.imagesShowStatus[link] = true;
    this.cdr.detectChanges();
  }

  trackImagesByFn(index: number, link: string) {
    return link;
  }
}
