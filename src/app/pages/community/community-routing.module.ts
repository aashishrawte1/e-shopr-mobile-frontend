import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunityPageComponent } from './community.page';

const routes: Routes = [
  {
    path: '',
    component: CommunityPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityPageRoutingModule {}
