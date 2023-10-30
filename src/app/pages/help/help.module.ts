import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HelpPageRoutingModule } from './help-routing.module';

import { HelpPageComponent } from './help.page';
import { SharedModule } from '../../modules/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpPageRoutingModule,
    SharedModule,
  ],
  declarations: [HelpPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HelpPageModule {}
