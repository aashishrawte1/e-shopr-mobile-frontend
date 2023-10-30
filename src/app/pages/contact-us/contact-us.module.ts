import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactUsPageRoutingModule } from './contact-us-routing.module';

import { ContactUsPageComponent } from './contact-us.page';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../modules/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ContactUsPageRoutingModule,
    SharedModule,
    FlexLayoutModule,
  ],
  declarations: [ContactUsPageComponent],
})
export class ContactUsPageModule {}
