import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePageComponent } from './profile.page';

import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../modules/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SharedModule,
    FlexLayoutModule,
  ],
  declarations: [ProfilePageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProfilePageModule {}
