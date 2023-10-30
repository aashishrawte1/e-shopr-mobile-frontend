import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductMatchesBarteringPageRoutingModule } from './bartering-product-matches-routing.module';

import { ProductMatchesBarteringPageComponent } from './bartering-product-matches.page';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    ProductMatchesBarteringPageRoutingModule,
  ],
  declarations: [ProductMatchesBarteringPageComponent],
})
export class BarteringProductMatchesPageModule {}
