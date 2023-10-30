import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotificationPageRoutingModule } from './notification-routing.module';

import { NotificationPageComponent } from './notification.page';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../../modules/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotificationPageRoutingModule,
    SharedModule,
    FlexLayoutModule,
  ],
  declarations: [NotificationPageComponent],
})
export class NotificationPageModule {}
