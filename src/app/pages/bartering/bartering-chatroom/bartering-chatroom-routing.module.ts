import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BarteringChatBoxPageComponent } from './bartering-chatroom.page';

const routes: Routes = [
  {
    path: '',
    component: BarteringChatBoxPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarteringChatBoxPageRoutingModule {}
