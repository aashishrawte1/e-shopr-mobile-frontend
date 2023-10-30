import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController, NavController } from '@ionic/angular';
import { PageRoutes } from '../../constants';
import { IProductResult } from '../../models';
import { IChatType } from '../../pages/chat/chat.page';
import { AppConfigService } from '../../services/app-config.service';
import { ProductFetcherService } from '../../services/product-fetcher.service';
import { StaticAssetService } from '../../services/static-asset.service';
import { StoreService } from '../../services/store.service';
import PageObserverComponent from '../../utils/component-observer.util';

@Component({
  selector: 'user-portal-product-tile',
  templateUrl: './product-tile.component.html',
  styleUrls: ['./product-tile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTileComponent
  extends PageObserverComponent
  implements OnInit {
  @Input() product: IProductResult;
  @Input() layoutType: 'boxLayout' | 'rowLayout';
  @Input() showDescription: boolean;
  @Input() showTags: boolean;
  @Input() showPrice: boolean;
  @Input() mediaContainerHeight: number;
  @Input() fontSize: number;

  _productDescription: string;
  _tags: any;
  _productTitle: string;
  constructor(
    public alertCtrl: AlertController,
    private cdr: ChangeDetectorRef,
    public sanitizer: DomSanitizer,
    public asset: StaticAssetService,
    private productService: ProductFetcherService,
    private appConfigService: AppConfigService,
    private navController: NavController,
    public storeService: StoreService
  ) {
    super();
  }
  async ngOnInit() {
    try {
      this._productTitle =
        this.product.title.length >
        this.appConfigService.constants.productTileNumberOfCharsInTitle
          ? `${this.product.title.substring(
              0,
              this.appConfigService.constants.productTileNumberOfCharsInTitle
            )}...`
          : this.product.title;
      this._productDescription = this.product?.description[1]?.text?.substring(
        0,
        this.appConfigService.constants.productTitleNumberOfCharsInDescription
      );

      this._tags = Object.keys(this.product.tags)
        .map((key) => '#' + key)
        .join(', ');

      this.cdr.detectChanges();
    } catch (error) {
      console.error(error);
    }
  }

  gotoProductDetail() {
    this.productService.goToProductDetailPage({ product: this.product });
  }

  onChatClick() {
    const chatType: IChatType = 'withGreenDay';
    this.navController.navigateBack(PageRoutes.fullUrls.chat, {
      state: {
        chatType,
      },
    });
  }
}
