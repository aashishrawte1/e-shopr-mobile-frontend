import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreditPageRoutingModule } from './credit-routing.module';

import { CreditPageComponent } from './credit.page';
import { SharedModule } from '../../modules/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreditPageRoutingModule,
    SharedModule,
  ],
  declarations: [CreditPageComponent],
})
export class CreditsPageModule {}
