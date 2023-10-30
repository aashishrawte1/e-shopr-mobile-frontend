import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'user-portal-welcome-quiz',
  templateUrl: './welcome-quiz.page.html',
  styleUrls: ['./welcome-quiz.page.scss'],
})
export class WelcomeQuizPageComponent implements OnInit {
  constructor(
    private storeService: StoreService,
    private appService: AppService
  ) {}

  async ngOnInit() {
    // this.storeService.welcomeQuizStatus.next({
    //   ...this.storeService.welcomeQuizStatus.data.value,
    //   startAt: this.appService.getISOTimestamp(),
    // });
  }
}
