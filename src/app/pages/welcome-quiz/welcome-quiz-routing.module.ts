import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageRoutes } from '../../constants';

import { WelcomeQuizPageComponent } from './welcome-quiz.page';

const routes: Routes = [
  {
    path: '',
    component: WelcomeQuizPageComponent,
    children: [
      {
        path: '',
        redirectTo: `${PageRoutes.shortUrls.welcomeQuizScreen1}`,
        pathMatch: 'full',
      },
      {
        path: `${PageRoutes.shortUrls.welcomeQuizScreen1}`,
        loadChildren: () =>
          import('./welcome-quiz-screen1/welcome-quiz-screen1.module').then(
            (m) => m.WelcomeQuizScreen1PageModule
          ),
      },

      {
        path: `${PageRoutes.shortUrls.welcomeQuizScreen3}`,
        loadChildren: () =>
          import('./welcome-quiz-screen3/welcome-quiz-screen3.module').then(
            (m) => m.WelcomeQuizScreen3PageModule
          ),
      },
      {
        path: `${PageRoutes.shortUrls.welcomeQuizScreen4}`,
        loadChildren: () =>
          import('./welcome-quiz-screen4/welcome-quiz-screen4.module').then(
            (m) => m.WelcomeQuizScreen4PageModule
          ),
      },
    ],
  },
  {
    path: 'welcome-quiz-screen4',
    loadChildren: () =>
      import('./welcome-quiz-screen4/welcome-quiz-screen4.module').then(
        (m) => m.WelcomeQuizScreen4PageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeQuizPageRoutingModule {}
