import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrdersPageRoutingModule } from './orders-routing.module';

import { OrdersPageComponent } from './orders.page';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../modules/shared.module';
import { CheckoutPageModule } from '../checkout/checkout.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    OrdersPageRoutingModule,
    SharedModule,
    CheckoutPageModule,
  ],
  declarations: [OrdersPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrdersPageModule {}
