import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BarteringHomePageComponent } from './bartering-home.page';

const routes: Routes = [
  {
    path: '',
    component: BarteringHomePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarteringHomePageRoutingModule {}
