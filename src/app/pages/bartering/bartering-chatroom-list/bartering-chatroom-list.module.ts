import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarteringChatListPageRoutingModule } from './bartering-chatroom-list-routing.module';
import { BarteringChatListPageComponent } from './bartering-chatroom-list.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    BarteringChatListPageRoutingModule,
  ],
  declarations: [BarteringChatListPageComponent],
})
export class BarteringChatRoomListPageModule {}
