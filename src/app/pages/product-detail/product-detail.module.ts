import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { IonicModule } from '@ionic/angular';
import { ProductDetailPageRoutingModule } from './product-detail-routing.module';
import { ProductDetailPageComponent } from './product-detail.page';
import { SharedModule } from '../../modules/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    ProductDetailPageRoutingModule,
    SharedModule,
    YouTubePlayerModule,
  ],
  declarations: [ProductDetailPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductDetailPageModule {}
