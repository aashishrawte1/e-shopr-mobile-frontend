import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { first, map } from 'rxjs/operators';
import { NUMBER_REGEX } from '../../../constants';
import { IBarteringProductItem } from '../../../models';
import { AppService } from '../../../services/app.service';
import { StaticAssetService } from '../../../services/static-asset.service';
import PageObserverComponent from '../../../utils/component-observer.util';
import { BarteringService } from '../bartering.service';
import { BarteringModifyProductFormValidators } from './bartering-modify-product.validator';
@Component({
  selector: 'user-portal-add-product-bartering',
  templateUrl: './bartering-modify-product.page.html',
  styleUrls: ['./bartering-modify-product.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductBarteringPageComponent
  extends PageObserverComponent
  implements OnInit {
  barteringProductForm: FormGroup;
  product: IBarteringProductItem;
  readonly minTitleLength = 1;
  readonly minDescriptionLength = 10;
  showNoProductImageError: boolean;
  placeholderImage =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/assets/bartering_icons/add-image-type-1.png';
  constructor(
    private cdr: ChangeDetectorRef,
    public assetService: StaticAssetService,
    private appService: AppService,
    private formBuilder: FormBuilder,
    private barteringService: BarteringService,
    private navController: NavController,
    private activatedRoute: ActivatedRoute
  ) {
    super();
  }
  async ngOnInit() {
    this.observe(
      this.activatedRoute.queryParamMap.pipe(
        first((val: any) => !!val),
        map((val) => val.params)
      ),
      async (params) => {
        this.product = {} as IBarteringProductItem;
        if (params?.productId) {
          this.product = await this.barteringService.fetchProductByProductId({
            productId: params.productId,
          });
        }
        this.loadForm();
        this.cdr.detectChanges();
      }
    );
  }

  loadForm() {
    const barteringInputs = {
      title: new FormControl(this.product?.title || '', [
        Validators.required,
        Validators.minLength(this.minTitleLength),
      ]),
      description: new FormControl(this.product?.description || '', [
        Validators.required,
        Validators.minLength(this.minDescriptionLength),
      ]),

      priceMin: new FormControl(this.product?.priceMin || '', [
        Validators.required,
        Validators.pattern(NUMBER_REGEX),
        BarteringModifyProductFormValidators.minPriceShouldBeLesserThanMaxPrice,
      ]),
      priceMax: new FormControl(this.product?.priceMax || '', [
        Validators.required,
        Validators.pattern(NUMBER_REGEX),
        BarteringModifyProductFormValidators.maxPriceShouldBeGreaterThanMinPrice,
      ]),
    };
    this.barteringProductForm = this.formBuilder.group(barteringInputs);
    this.cdr.detectChanges();
  }

  get title() {
    return this.barteringProductForm.controls.title;
  }
  get description() {
    return this.barteringProductForm.controls.description;
  }
  get priceMin() {
    return this.barteringProductForm.controls.priceMin;
  }
  get priceMax() {
    return this.barteringProductForm.controls.priceMax;
  }

  async addProductImage(index: number) {
    const response = await this.barteringService.chooseImage();
    if (!!!response) {
      return;
    }

    this.product.images = this.product.images || [];
    this.product.images[index] = response;
    this.cdr.detectChanges();
  }

  goBack() {
    this.navController.back();
  }

  async modifyProduct() {
    if (!this.product.images?.length) {
      this.showNoProductImageError = true;
      return;
    }

    if (!this.barteringProductForm.valid) {
      return;
    }
    await this.appService.showLoader({
      message: 'Saving product',
      duration: 1000,
    });
    this.barteringService
      .modifyProduct({
        ...this.barteringProductForm.value,
        images: this.product.images,
        productId: this.product.productId || '',
      })
      .then((_) => {
        this.barteringService.getAllProductsPostedByUser();
      });
    this.barteringProductForm.reset();
    this.navController.back();
  }

  async onRemoveButtonClick() {
    const loader = await this.appService.showLoader({
      message: 'Deleting product',
    });
    await this.barteringService.deleteProduct({
      productId: this.product.productId,
    });
    await loader.dismiss();
    this.barteringService.getAllProductsPostedByUser();
    this.navController.back();
  }

  removeProductImage(index: number) {
    this.product.images.splice(index, 1);
  }
}
