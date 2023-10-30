import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeQuizScreen1PageComponent } from './welcome-quiz-screen1.page';

const routes: Routes = [
  {
    path: '',
    component: WelcomeQuizScreen1PageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeQuizScreen1PageRoutingModule {}
