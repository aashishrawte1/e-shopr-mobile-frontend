import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LikesPageComponent } from './likes.page';

const routes: Routes = [
  {
    path: '',
    component: LikesPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LikesPageRoutingModule {}
