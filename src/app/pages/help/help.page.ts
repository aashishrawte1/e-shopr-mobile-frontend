import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { NavController } from '@ionic/angular';
import { HelpPageData } from '../../models/app-data.model';
import { StoreService } from '../../services/store.service';
import PageObserverComponent from '../../utils/component-observer.util';

@Component({
  selector: 'help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpPageComponent extends PageObserverComponent implements OnInit {
  pageConfig: HelpPageData;
  constructor(
    private cdr: ChangeDetectorRef,
    private storeService: StoreService,
    private navController: NavController
  ) {
    super();
  }

  async ngOnInit() {
    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.helpPage;
      this.cdr.detectChanges();
    });
  }

  goBack() {
    this.navController.back();
  }
}
