import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { ErrorPageData } from '../../models/app-data.model';
import { AppConfigService } from '../../services/app-config.service';
import { StoreService } from '../../services/store.service';
import PageObserverComponent from '../../utils/component-observer.util';
import { useSubject } from '../../utils/useSubject';

@Component({
  selector: 'user-portal-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent
  extends PageObserverComponent
  implements OnInit {
  pageConfig: ErrorPageData;
  constructor(
    private storeService: StoreService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.errorPage;
      this.cdr.detectChanges();
    });
  }
}
