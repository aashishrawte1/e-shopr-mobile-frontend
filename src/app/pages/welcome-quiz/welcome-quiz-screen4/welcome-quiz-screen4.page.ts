import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PageRoutes } from '../../../constants';
import { gtmEventNames } from '../../../models/gtm-event.model';
import { ApiService } from '../../../services/api.service';
import { AppService } from '../../../services/app.service';
import { CustomGoogleTagManagerService } from '../../../services/custom-google-tag-manager.service';
import { StoreService } from '../../../services/store.service';
import { default as questions } from '../registration_welcome_quiz_question_2020-11-01.json';
import { WelcomeQuizOption } from '../welcome-quiz.model';
@Component({
  selector: 'user-portal-welcome-quiz-screen4',
  templateUrl: './welcome-quiz-screen4.page.html',
  styleUrls: ['./welcome-quiz-screen4.page.scss'],
})
export class WelcomeQuizScreen4PageComponent implements OnInit {
  question = questions.q2.question;
  options: Array<WelcomeQuizOption> = questions.q2.options;
  nextButtonMessage = 'Submit';
  isButtonDisabled = true;
  green_star_outline =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/welcome_quiz_images/green_star_outline.svg';
  green_star =
    'https://eshopr1in.blr1.digitaloceanspaces.com/cdn/user-portal/welcome_quiz_images/green_star.svg';
  isSelected = [false, false, false, false, false];
  buttonSelected = -1;
  constructor(
    private navController: NavController,
    private apiService: ApiService,
    private storeService: StoreService,
    private appService: AppService,
    private gtmService: CustomGoogleTagManagerService
  ) {}

  ngOnInit() {}

  getSelectedItems() {
    return this.options.filter((o) => o.selected);
  }

  // async onOptionClick(option: WelcomeQuizOption) {
  //   for (const op of this.options) {
  //     if (op.value !== option.value) {
  //       op.selected = false;
  //       continue;
  //     }

  //     op.selected = true;
  //   }

  //   this.isButtonDisabled = false;
  // }

  async goToNextPage() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.registerNewAccountClick,
      });
    } catch (error) {}
    if (this.isButtonDisabled) {
      return;
    }

    this.storeService.registrationWelcomeQuiz.endAt = this.appService.getISOTimestamp();
    this.storeService.registrationWelcomeQuiz.responses.q2.response = this.getSelectedItems()
      .map((s) => s.value)
      .join(',');

    this.apiService.postRegistrationWelcomeQuizResponse(
      this.storeService.registrationWelcomeQuiz
    );
    this.storeService.welcomeQuizCompletedEventStream.next(true);
    this.navController.navigateRoot(PageRoutes.fullUrls.home, {
      replaceUrl: true,
    });
  }

  async toggleStarZero() {
    this.isSelected = [true, false, false, false, false];
    this.isButtonDisabled = false;
    this.buttonSelected = 0;
    for (let i = 0; i < 5; i++) {
      if (i == 0) {
        this.options[i].selected = true;
      } else {
        this.options[i].selected = false;
      }
    }
  }
  async toggleStarOne() {
    this.isSelected = [true, true, false, false, false];
    this.isButtonDisabled = false;
    this.buttonSelected = 1;
    for (let i = 0; i < 5; i++) {
      if (i == 1) {
        this.options[i].selected = true;
      } else {
        this.options[i].selected = false;
      }
    }
  }
  async toggleStarTwo() {
    this.isSelected = [true, true, true, false, false];
    this.isButtonDisabled = false;
    this.buttonSelected = 2;
    for (let i = 0; i < 5; i++) {
      if (i == 2) {
        this.options[i].selected = true;
      } else {
        this.options[i].selected = false;
      }
    }
  }
  async toggleStarThree() {
    this.isSelected = [true, true, true, true, false];
    this.isButtonDisabled = false;
    this.buttonSelected = 3;
    for (let i = 0; i < 5; i++) {
      if (i == 3) {
        this.options[i].selected = true;
      } else {
        this.options[i].selected = false;
      }
    }
  }
  async toggleStarFour() {
    this.isSelected = [true, true, true, true, true];
    this.isButtonDisabled = false;
    this.buttonSelected = 4;
    for (let i = 0; i < 5; i++) {
      if (i == 4) {
        this.options[i].selected = true;
      } else {
        this.options[i].selected = false;
      }
    }
  }
}
