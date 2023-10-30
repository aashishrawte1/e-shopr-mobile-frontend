import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BarteringChatListPageComponent } from './bartering-chatroom-list.page';

const routes: Routes = [
  {
    path: '',
    component: BarteringChatListPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarteringChatListPageRoutingModule {}
