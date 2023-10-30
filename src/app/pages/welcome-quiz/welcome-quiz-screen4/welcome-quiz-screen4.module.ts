import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeQuizScreen4PageRoutingModule } from './welcome-quiz-screen4-routing.module';

import { WelcomeQuizScreen4PageComponent } from './welcome-quiz-screen4.page';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexLayoutModule,
    WelcomeQuizScreen4PageRoutingModule,
  ],
  declarations: [WelcomeQuizScreen4PageComponent],
})
export class WelcomeQuizScreen4PageModule {}
