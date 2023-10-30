import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePageComponent } from './home.page';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../modules/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    HomePageRoutingModule,
    SharedModule,
  ],
  declarations: [HomePageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePageModule {}
