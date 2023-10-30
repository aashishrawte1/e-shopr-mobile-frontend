import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../../../modules/shared.module';
import { BarteringChatBoxPageRoutingModule } from './bartering-chatroom-routing.module';
import { BarteringChatBoxPageComponent } from './bartering-chatroom.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    SharedModule,
    BarteringChatBoxPageRoutingModule,
  ],
  declarations: [BarteringChatBoxPageComponent],
})
export class BarteringChatBoxPageModule {}
