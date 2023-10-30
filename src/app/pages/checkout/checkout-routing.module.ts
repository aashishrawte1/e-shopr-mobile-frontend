import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutPageComponent } from './checkout.page';

const routes: Routes = [
  {
    path: '',
    component: CheckoutPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutPageRoutingModule {}
