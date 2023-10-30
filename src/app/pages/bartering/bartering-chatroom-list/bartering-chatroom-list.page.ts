import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { PageRoutes } from '../../../constants';
import { IBarteringChatListDisplayItem } from '../../../models';
import { StaticAssetService } from '../../../services/static-asset.service';
import { StoreService } from '../../../services/store.service';
import PageObserverComponent from '../../../utils/component-observer.util';
import { useSubject } from '../../../utils/useSubject';

@Component({
  selector: 'user-portal-bartering-chat-list',
  templateUrl: './bartering-chatroom-list.page.html',
  styleUrls: ['./bartering-chatroom-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarteringChatListPageComponent
  extends PageObserverComponent
  implements OnInit {
  chatRoomList = useSubject<Array<IBarteringChatListDisplayItem>>(null);
  constructor(
    private storeService: StoreService,
    private navController: NavController,
    public assetService: StaticAssetService
  ) {
    super();
  }

  async ngOnInit() {
    this.observe(
      this.storeService.barteringChatRoomList.pipe(
        filter((l) => !!(l && l.length))
      ),
      (list) => {
        this.chatRoomList.next(list);
      }
    );
  }

  goBack() {
    this.navController.back();
  }

  openChatroom(productIds: string) {
    this.navController.navigateForward(
      `${PageRoutes.fullUrls.barteringChatroom}?productIds=${productIds}`
    );
  }
}
