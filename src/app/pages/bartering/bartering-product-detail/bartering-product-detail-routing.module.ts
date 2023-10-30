import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductDetailBarteringPageComponent } from './bartering-product-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ProductDetailBarteringPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductDetailBarteringPageRoutingModule {}
