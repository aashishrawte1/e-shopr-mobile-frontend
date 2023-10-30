import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'user-portal-credit',
  templateUrl: './credit.page.html',
  styleUrls: ['./credit.page.scss'],
})
export class CreditPageComponent implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goBack() {
    this.navController.back();
  }
}
