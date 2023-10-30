import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrivacyPolicyPageRoutingModule } from './privacy-policy-routing.module';

import { PrivacyPolicyPageComponent } from './privacy-policy.page';
import { SharedModule } from '../../modules/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivacyPolicyPageRoutingModule,
    SharedModule,
  ],
  declarations: [PrivacyPolicyPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PrivacyPolicyPageModule {}
