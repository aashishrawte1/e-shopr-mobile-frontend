import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeQuizScreen3PageRoutingModule } from './welcome-quiz-screen3-routing.module';

import { WelcomeQuizScreen3PageComponent } from './welcome-quiz-screen3.page';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    WelcomeQuizScreen3PageRoutingModule,
  ],
  declarations: [WelcomeQuizScreen3PageComponent],
})
export class WelcomeQuizScreen3PageModule {}
