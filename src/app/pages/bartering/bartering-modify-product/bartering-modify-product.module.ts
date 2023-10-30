import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddProductBarteringPageRoutingModule } from './bartering-modify-product-routing.module';
import { AddProductBarteringPageComponent } from './bartering-modify-product.page';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddProductBarteringPageRoutingModule,
    FlexLayoutModule,
  ],
  declarations: [AddProductBarteringPageComponent],
})
export class BarteringAddProductPageModule {}
