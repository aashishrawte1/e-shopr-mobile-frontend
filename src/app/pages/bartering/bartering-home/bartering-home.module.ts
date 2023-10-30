import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BarteringHomePageRoutingModule } from './bartering-home-routing.module';

import { BarteringHomePageComponent } from './bartering-home.page';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    BarteringHomePageRoutingModule,
  ],
  declarations: [BarteringHomePageComponent],
})
export class BarteringHomePageModule {}
