import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeQuizScreen4PageComponent } from './welcome-quiz-screen4.page';

const routes: Routes = [
  {
    path: '',
    component: WelcomeQuizScreen4PageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeQuizScreen4PageRoutingModule {}
