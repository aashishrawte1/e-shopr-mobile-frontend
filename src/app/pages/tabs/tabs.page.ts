import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { CustomGoogleTagManagerService } from '../../services/custom-google-tag-manager.service';
import { TabsPageData } from '../../models/app-data.model';
import { gtmEventNames } from '../../models/gtm-event.model';
import { AppService } from '../../services/app.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { StaticAssetService } from '../../services/static-asset.service';
import { StoreService } from '../../services/store.service';
import PageObserverComponent from '../../utils/component-observer.util';

declare var $zoho: any;
@Component({
  selector: 'user-portal-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsPageComponent
  extends PageObserverComponent
  implements OnInit, AfterViewInit {
  @ViewChild('mainTab') tabs: IonTabs;
  cartItemCount = 0;
  selectedTab: string;
  pageConfig: TabsPageData;
  constructor(
    private storeService: StoreService,
    public assetService: StaticAssetService,
    private cdr: ChangeDetectorRef,
    private shoppingCartService: ShoppingCartService,
    @Inject(DOCUMENT) private document: Document,
    private appService: AppService,
    private gtmService: CustomGoogleTagManagerService
  ) {
    super();
  }

  async ngOnInit() {
    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.tabsPage;
      this.cdr.detectChanges();
    });
    this.observe(this.storeService.shoppingCart, async (val) => {
      this.cartItemCount = await this.shoppingCartService.getTotalItemCountInCart();
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    if (!this.storeService.tabHeight) {
      const searchItemInterval = setInterval(() => {
        const { height } = this.document
          .querySelector('.main-tab-bar')
          ?.getBoundingClientRect();
        if (height) {
          this.storeService.tabHeight = height;
          this.positionCustomToast(height);
          clearInterval(searchItemInterval);
        }
      }, 200);
    }
  }

  positionCustomToast(height: number) {
    this.storeService.tabHeight = +height;
    const style = this.document.createElement('style');
    style.innerHTML = `
    .custom-toast {
      transform: translateY(calc(-${
        this.storeService.tabHeight + 10
      }px + (var(--ion-safe-area-bottom) + 10px)));
    }
    `;
    this.document.body.appendChild(style);
  }

  async onTabDidChange() {
    this.selectedTab = this.tabs.getSelected();
    this.cdr.detectChanges();
  }

  onTabItemClick(tabName: string) {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.tabIconClick,
        tabItem: tabName,
      });
    } catch (error) {}
    if (tabName === this.selectedTab) {
      this.appService.scrollElementIntoView(
        '.ion-page:not(.ion-page-hidden) .pageTopIndicator'
      );
    }
  }
  openChat() {
    $zoho.salesiq.floatwindow.visible('show');
  }
}
