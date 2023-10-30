import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddProductBarteringPageComponent } from './bartering-modify-product.page';

const routes: Routes = [
  {
    path: '',
    component: AddProductBarteringPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProductBarteringPageRoutingModule {}
