import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { PrivacyPolicyPageData } from '../../models/app-data.model';
import { AppConfigService } from '../../services/app-config.service';
import { StoreService } from '../../services/store.service';
import PageObserverComponent from '../../utils/component-observer.util';

@Component({
  selector: 'privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyPageComponent
  extends PageObserverComponent
  implements OnInit {
  pageConfig: PrivacyPolicyPageData;
  constructor(
    public actionSheetCtrl: ActionSheetController,
    public appConfigService: AppConfigService,
    private navController: NavController,
    private cdr: ChangeDetectorRef,
    private storeService: StoreService
  ) {
    super();
  }

  async ngOnInit() {
    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.privacyPolicyPage;
      this.cdr.detectChanges();
    });
  }

  goToPage(page: string) {
    this.navController.navigateBack(page);
  }

  goBack() {
    this.navController.back();
  }
}
