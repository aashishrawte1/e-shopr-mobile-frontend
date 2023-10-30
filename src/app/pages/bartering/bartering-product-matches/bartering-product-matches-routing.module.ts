import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductMatchesBarteringPageComponent } from './bartering-product-matches.page';

const routes: Routes = [
  {
    path: '',
    component: ProductMatchesBarteringPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductMatchesBarteringPageRoutingModule {}
