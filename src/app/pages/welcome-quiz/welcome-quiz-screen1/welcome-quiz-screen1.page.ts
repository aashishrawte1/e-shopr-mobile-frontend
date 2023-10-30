import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PageRoutes } from '../../../constants';
import { AppService } from '../../../services/app.service';
import { StaticAssetService } from '../../../services/static-asset.service';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'user-portal-welcome-quiz-screen1',
  templateUrl: './welcome-quiz-screen1.page.html',
  styleUrls: ['./welcome-quiz-screen1.page.scss'],
})
export class WelcomeQuizScreen1PageComponent implements OnInit {
  constructor(
    public assetService: StaticAssetService,
    private navController: NavController,
    private storeService: StoreService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.storeService.registrationWelcomeQuiz.activePage = 'screen1';
    this.storeService.registrationWelcomeQuiz.startAt = this.appService.getISOTimestamp();
  }

  goToLoginPage() {
    this.navController.navigateRoot(PageRoutes.fullUrls.login, {
      replaceUrl: true,
    });
  }

  goToNextPage() {
    this.navController.navigateRoot(
      PageRoutes.fullUrls.registrationWelcomeQuizScreen3,
      {
        replaceUrl: true,
      }
    );
  }
}
