import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PageRoutes } from '../../../constants';
import { WelcomeQuizOption } from '../welcome-quiz.model';
import { default as questions } from '../registration_welcome_quiz_question_2020-11-01.json';
import { StoreService } from '../../../services/store.service';
@Component({
  selector: 'user-portal-welcome-quiz-screen3',
  templateUrl: './welcome-quiz-screen3.page.html',
  styleUrls: ['./welcome-quiz-screen3.page.scss'],
})
export class WelcomeQuizScreen3PageComponent implements OnInit {
  question = questions.q1.question;
  options: Array<WelcomeQuizOption> = questions.q1.options;
  nextButtonMessage = 'Select 3';
  isButtonDisabled = true;
  constructor(
    private navController: NavController,
    private storeService: StoreService
  ) {}

  ngOnInit() {
    this.storeService.registrationWelcomeQuiz.activePage = 'screen3';
  }

  getSelectedItems() {
    return this.options.filter((o) => o.selected);
  }

  async onOptionClick(option: WelcomeQuizOption) {
    if (option.selected) {
      option.selected = false;
      this.nextButtonMessage = 'Select 3';
      this.isButtonDisabled = true;
      return;
    }
    let itemsSelectedLength = this.getSelectedItems().length;
    // since user has clicked on an item,

    if (itemsSelectedLength < 3) {
      this.nextButtonMessage = 'Select 3';
      option.selected = true;
      itemsSelectedLength = this.getSelectedItems().length;
      if (itemsSelectedLength === 3) {
        this.nextButtonMessage = 'Continue';
        this.isButtonDisabled = false;
      }
      return;
    }

    // since the selection is already 3
    if (itemsSelectedLength >= 3) {
      this.nextButtonMessage = 'Continue';
    }
  }
  async goToNextPage() {
    if (this.isButtonDisabled) {
      return;
    }
    this.storeService.registrationWelcomeQuiz.responses.q1.response = this.getSelectedItems()
      .map((s) => s.value)
      .join(',');
    this.navController.navigateRoot(
      PageRoutes.fullUrls.registrationWelcomeQuizScreen4,
      {
        replaceUrl: true,
      }
    );
  }
}
