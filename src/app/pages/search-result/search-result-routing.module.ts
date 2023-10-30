import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SearchResultPageComponent } from './search-result.page';

const routes: Routes = [
  {
    path: '',
    component: SearchResultPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchResultPageRoutingModule {}
