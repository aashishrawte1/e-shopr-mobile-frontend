import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../modules/shared.module';
import { CheckoutPageRoutingModule } from './checkout-routing.module';
import { CheckoutPageComponent } from './checkout.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    SharedModule,
    CheckoutPageRoutingModule,
  ],
  declarations: [CheckoutPageComponent],
})
export class CheckoutPageModule {}
