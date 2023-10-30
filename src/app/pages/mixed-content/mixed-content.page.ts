import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ActionSheetController, NavController } from '@ionic/angular';
import { IRangeTracker } from '../../models';
import { IMixedDataResult } from '../../models/IGetMixedDataResponse';
import { AppService } from '../../services/app.service';
import { StaticAssetService } from '../../services/static-asset.service';
import { MixedDataGetterService } from '../../services/mixed-data.service';
import PageObserverComponent from '../../utils/component-observer.util';
import { shuffleArray } from '../../utils/shuffleArray';

@Component({
  selector: 'user-portal-mixed-content',
  templateUrl: './mixed-content.page.html',
  styleUrls: ['./mixed-content.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MixedContentPageComponent extends PageObserverComponent {
  minItemToShow = 100;
  _title: any;
  _spinTitle: any;
  mixedData: IMixedDataResult;
  itemRange: IRangeTracker = {
    previous: null,
    current: {
      start: 1,
      end: this.minItemToShow,
    },
  };
  itemsToShow: any;
  routerState: any;
  constructor(
    public actionSheetCtrl: ActionSheetController,
    private appService: AppService,
    public router: Router,
    private cdr: ChangeDetectorRef,
    public asset: StaticAssetService,
    public sanitizer: DomSanitizer,
    private mixedDataService: MixedDataGetterService,
    private navController: NavController
  ) {
    super();
  }
  async doRefresh(event: any) {
    event.target.complete();
  }

  async ionViewWillEnter() {
    this.routerState = this.appService.getRouterState() || this.routerState;
    if (!this.routerState) {
      return;
    }
    const tags = Object.keys(this.routerState.tags);
    this._spinTitle = this.routerState.text;
    this._title = await this.mixedContentTitle(
      tags.toString().replace(',', ' ')
    );
    this.appService.showSpinner({
      message: 'Loading products. Please wait...',
    });
    const table = Object.keys(this.routerState.table);
    const content = await this.mixedDataService.getMixedData({ tags, table });
    if (!content) {
      return;
    }
    this.mixedData = content;

    const itemsToShow = [
      ...(content.links || []).map((link) => {
        return { ...link, type: 'link' };
      }),
      ...(content.products || []).map((link) => {
        return { ...link, type: 'product' };
      }),
    ];
    if (tags.length === 0) {
      shuffleArray(itemsToShow.splice(0, 10));
      this.itemsToShow = itemsToShow.splice(0, 10);
    } else {
      shuffleArray(itemsToShow);
      this.itemsToShow = itemsToShow;
    }

    this.cdr.detectChanges();
  }

  async mixedContentTitle(tags: string) {
    const splitTags = tags.toLowerCase().split(' ');
    for (let i = 0; i < splitTags.length; i++) {
      splitTags[i] =
        '#' + splitTags[i].charAt(0).toUpperCase() + splitTags[i].substring(1);
      splitTags.toString().replace(' ', ',');
    }
    return splitTags;
  }

  goBack() {
    this.navController.back();
  }
}
