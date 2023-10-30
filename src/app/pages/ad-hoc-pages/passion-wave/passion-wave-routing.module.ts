import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassionWavePageComponent } from './passion-wave.page';

const routes: Routes = [
  {
    path: '',
    component: PassionWavePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassionWavePageRoutingModule {}
