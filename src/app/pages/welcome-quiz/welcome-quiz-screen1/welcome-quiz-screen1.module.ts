import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeQuizScreen1PageRoutingModule } from './welcome-quiz-screen1-routing.module';

import { WelcomeQuizScreen1PageComponent } from './welcome-quiz-screen1.page';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    WelcomeQuizScreen1PageRoutingModule,
  ],
  declarations: [WelcomeQuizScreen1PageComponent],
})
export class WelcomeQuizScreen1PageModule {}
