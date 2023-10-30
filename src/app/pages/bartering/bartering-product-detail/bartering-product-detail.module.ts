import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDetailBarteringPageRoutingModule } from './bartering-product-detail-routing.module';

import { ProductDetailBarteringPageComponent } from './bartering-product-detail.page';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../../modules/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    SharedModule,
    ProductDetailBarteringPageRoutingModule,
  ],
  declarations: [ProductDetailBarteringPageComponent],
})
export class BarteringProductDetailPageModule {}
