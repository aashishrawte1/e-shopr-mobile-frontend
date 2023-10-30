import { Component, Input, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AlertController, NavController } from '@ionic/angular';
import { PageRoutes } from '../../constants';
import { ArticleEntity } from '../../models';
import { IChatType } from '../../pages/chat/chat.page';
import { AppService } from '../../services/app.service';
import { StaticAssetService } from '../../services/static-asset.service';
import PageObserverComponent from '../../utils/component-observer.util';

@Component({
  selector: 'user-portal-article-tile',
  templateUrl: './article-tile.component.html',
  styleUrls: ['./article-tile.component.scss'],
})
export class ArticleTileComponent
  extends PageObserverComponent
  implements OnInit {
  @Input() item: ArticleEntity;
  @Input() showDescription: boolean;
  @Input() layoutType: 'boxLayout' | 'rowLayout';
  @Input() mediaContainerHeight: number;
  @Input() fontSize: number;

  constructor(
    private navController: NavController,
    public alertCtrl: AlertController,
    public asset: StaticAssetService,
    private appService: AppService
  ) {
    super();
  }

  ngOnInit() {}

  onChatClick() {
    const chatType: IChatType = 'withGreenDay';
    this.navController.navigateForward(PageRoutes.fullUrls.chat, {
      state: {
        chatType,
      },
    });
  }

  openArticle() {
    this.appService.openInAppBrowser({ url: this.item.url });
  }
}
