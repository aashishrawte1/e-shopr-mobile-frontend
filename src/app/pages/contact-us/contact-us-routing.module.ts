import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContactUsPageComponent } from './contact-us.page';

const routes: Routes = [
  {
    path: '',
    component: ContactUsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactUsPageRoutingModule {}
