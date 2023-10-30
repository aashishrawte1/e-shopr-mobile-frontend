import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShoppingCartPageRoutingModule } from './shopping-cart-routing.module';

import { ShoppingCartPageComponent } from './shopping-cart.page';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { CheckoutPageModule } from '../checkout/checkout.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    ShoppingCartPageRoutingModule,
    SharedModule,
    CheckoutPageModule,
  ],
  declarations: [ShoppingCartPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ShoppingCartPageModule {}
