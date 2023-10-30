import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ErrorPageRoutingModule } from './error-routing.module';

import { ErrorPageComponent } from './error.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ErrorPageRoutingModule],
  declarations: [ErrorPageComponent],
})
export class ErrorPageModule {}
