import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditPageComponent } from './credit.page';

const routes: Routes = [
  {
    path: '',
    component: CreditPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditPageRoutingModule {}
