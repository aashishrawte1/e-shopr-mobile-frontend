import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WelcomeQuizPageRoutingModule } from './welcome-quiz-routing.module';

import { WelcomeQuizPageComponent } from './welcome-quiz.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomeQuizPageRoutingModule,
  ],
  declarations: [WelcomeQuizPageComponent],
})
export class WelcomeQuizPageModule {}
