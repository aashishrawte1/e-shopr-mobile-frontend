import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpinTheWheelComponent } from './spin-the-wheel.page';

const routes: Routes = [
  {
    path: '',
    component: SpinTheWheelComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamePageRoutingModule {}
