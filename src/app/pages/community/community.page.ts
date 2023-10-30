import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ActionSheetController,
  IonContent,
  NavController,
} from '@ionic/angular';
import { CustomGoogleTagManagerService } from '../../services/custom-google-tag-manager.service';
import { filter } from 'rxjs/operators';
import {
  DETAIL_PAGE_SLIDER_CONFIG,
  HOME_PAGE_FEATURED_SLIDER_CONFIG,
  PageRoutes,
} from '../../constants';
import { ArticleEntity, IRangeTracker } from '../../models';
import { CommunityPageData } from '../../models/app-data.model';
import { gtmEventNames } from '../../models/gtm-event.model';
import { AppService } from '../../services/app.service';
import { ArticleService } from '../../services/article.service';
import { StaticAssetService } from '../../services/static-asset.service';
import { StoreService } from '../../services/store.service';
import PageObserverComponent from '../../utils/component-observer.util';
@Component({
  selector: 'user-portal-community-page',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityPageComponent
  extends PageObserverComponent
  implements OnInit {
  @ViewChild('communityContent') content: IonContent;
  sliderConfig = DETAIL_PAGE_SLIDER_CONFIG;
  sliderConfigPopular = HOME_PAGE_FEATURED_SLIDER_CONFIG;
  minItemToShow = 100;

  articles: ArticleEntity[];

  itemRange: IRangeTracker;
  pageConfig: CommunityPageData;
  gtmPageBottomHit: any;
  constructor(
    public actionSheetCtrl: ActionSheetController,
    private navController: NavController,
    private cdr: ChangeDetectorRef,
    public assetService: StaticAssetService,
    private appService: AppService,
    private storeService: StoreService,
    private articleService: ArticleService,
    private gtmService: CustomGoogleTagManagerService
  ) {
    super();
  }

  async doRefresh(event: any) {
    await this.articleService.fetchArticles(this.itemRange.current);
    event.target.complete();
    this.cdr.detectChanges();
  }
  async ngOnInit() {
    this.itemRange = this.appService.getInitialRange({
      incrementBy: 100,
    });
    this.observe(
      this.storeService.articles.pipe(filter((articles) => !!articles?.length)),
      (articles) => {
        this.articles = articles;
        this.cdr.detectChanges();
      }
    );

    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.communityPage;
      this.cdr.detectChanges();
    });
  }
  gotoArticleDetail(article: ArticleEntity) {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.communityPageArticleItemClick,
        articleTitle: article.title,
        articleId: article.uniqueId,
      });
    } catch (error) {}

    this.navController.navigateForward(
      `${PageRoutes.shortUrls.articleDetail}/${article.uniqueId}`
    );
  }

  async onPageScrollEnd() {
    const scrollElement = await this.content.getScrollElement();
    if (this.gtmPageBottomHit) {
      return;
    }
    if (
      scrollElement.scrollTop + scrollElement.clientHeight <=
      scrollElement.scrollHeight - 20
    ) {
      return;
    }

    this.gtmPageBottomHit = true;
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.communityPageBottomHit,
      });
    } catch (error) {}
  }

  articleTrackByFn(index: number, item: ArticleEntity) {
    return item.uniqueId;
  }
}
