import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LikesPageRoutingModule } from './likes-routing.module';

import { LikesPageComponent } from './likes.page';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../modules/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    LikesPageRoutingModule,
    SharedModule,
  ],
  declarations: [LikesPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LikesPageModule {}
