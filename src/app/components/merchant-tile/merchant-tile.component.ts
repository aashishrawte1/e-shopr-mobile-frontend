import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { PageRoutes } from '../../constants';
import { ActiveFilterItem } from '../../models';
import { StaticAssetService } from '../../services/static-asset.service';
import PageObserverComponent from '../../utils/component-observer.util';

@Component({
  selector: 'user-portal-merchant-tile',
  templateUrl: './merchant-tile.component.html',
  styleUrls: ['./merchant-tile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MerchantTileComponent
  extends PageObserverComponent
  implements OnInit {
  @Input() merchant: ActiveFilterItem;
  @Input() layoutType: 'boxLayout';
  @Input() mediaContainerHeight: number;
  @Input() fontSize: number;

  constructor(
    public router: Router,
    public alertCtrl: AlertController,
    public sanitizer: DomSanitizer,
    public asset: StaticAssetService,
    private navController: NavController
  ) {
    super();
  }
  async ngOnInit() {}

  async goToMarketPage() {
    this.navController.navigateForward(PageRoutes.fullUrls.market, {
      state: {
        activeFilter: { ...this.merchant, selected: true },
      },
    });
  }
}
