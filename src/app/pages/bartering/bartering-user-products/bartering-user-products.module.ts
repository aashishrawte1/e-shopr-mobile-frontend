import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BarteringUserProductsPageRoutingModule } from './bartering-user-products-routing.module';

import { BarteringUserProductsPageComponent } from './bartering-user-products.page';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    BarteringUserProductsPageRoutingModule,
  ],
  declarations: [BarteringUserProductsPageComponent],
})
export class BarteringUserProductsPageModule {}
