import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ActionSheetController, NavController } from '@ionic/angular';

@Component({
  selector: 'notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationPageComponent implements OnInit {
  pushes: any = [];
  constructor(
    public actionSheetCtrl: ActionSheetController,
    public router: Router,
    private navController: NavController
  ) {}

  async ngOnInit() {}

  goBack() {
    this.navController.back();
  }
}
