import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BarteringUserProductsPageComponent } from './bartering-user-products.page';

const routes: Routes = [
  {
    path: '',
    component: BarteringUserProductsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarteringUserProductsPageRoutingModule {}
