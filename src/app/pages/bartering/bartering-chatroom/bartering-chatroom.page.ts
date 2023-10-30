import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, NavController } from '@ionic/angular';
import { first, map } from 'rxjs/operators';
import { AppService } from '../../../services/app.service';
import { StaticAssetService } from '../../../services/static-asset.service';
import { StoreService } from '../../../services/store.service';
import PageObserverComponent from '../../../utils/component-observer.util';
import { SubscriptionManager } from '../../../utils/subscription-manager.util';
import { useSubject } from '../../../utils/useSubject';
import { BarteringChatService } from '../bartering-chat.service';
import {
  IBarteringChatListDisplayItem,
  IBarteringMessageExtra,
} from '../bartering.model';

@Component({
  selector: 'user-portal-bartering-chat-box',
  templateUrl: './bartering-chatroom.page.html',
  styleUrls: ['./bartering-chatroom.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarteringChatBoxPageComponent
  extends PageObserverComponent
  implements OnInit {
  @ViewChild('chatContainer') chatContainer: IonContent;
  productIdArr: Array<string>;
  messages = useSubject<Array<IBarteringMessageExtra>>([]);
  subscriptionManager = new SubscriptionManager();
  roomInfo: IBarteringChatListDisplayItem;
  constructor(
    private navController: NavController,
    private chatService: BarteringChatService,
    public storeService: StoreService,
    private cdr: ChangeDetectorRef,
    public assetService: StaticAssetService,
    private activatedRoute: ActivatedRoute,
    private appService: AppService
  ) {
    super();
  }

  async ngOnInit() {
    this.observe(
      this.activatedRoute.queryParamMap.pipe(
        first((val: any) => !!val),
        map((val) => val.params)
      ),
      async (params) => {
        const { productIds } = params || {};
        this.productIdArr = productIds.trim().split(',').sort();
        this.storeService.barteringChatRoomList
          .pipe(
            first(
              (list) =>
                !!(
                  list &&
                  list.length &&
                  list.find(
                    (item) => item.allProductIds === this.productIdArr.join(',')
                  )
                )
            ),
            map((list) =>
              list.find(
                (item) => item.allProductIds === this.productIdArr.join(',')
              )
            )
          )
          .subscribe((roomInfo) => {
            this.roomInfo = roomInfo;
            this.cdr.detectChanges();
          });
        if (!(this.productIdArr?.length > 1)) {
          this.navController.back();
          return;
        }

        // remove all previous subscriptions
        this.subscriptionManager.unsubscribeAll();
        this.subscriptionManager.manage(
          await this.chatService.subscribeToChatRoomMessages(this.productIdArr),
          (messages) => {
            this.messages.next(messages);
            this.chatContainer.scrollToBottom(200);
          }
        );
        this.cdr.detectChanges();
      }
    );
  }

  async onComment(comment: string) {
    if (!(comment && comment.length)) {
      return;
    }

    const currentTime = this.appService.getISOTimestamp();

    const msg: IBarteringMessageExtra = {
      author: {
        name: this.storeService.loggedInUser.value.fullName,
        uid: this.storeService.loggedInUser.value.uid,
      },
      message: comment,
      time: currentTime,
      displayTime: this.appService.getChatDisplayTime(currentTime),
    };

    this.messages.next([...this.messages.value, msg]);

    this.chatService.sendMessage({
      message: comment,
      productIds: this.productIdArr,
    });
  }

  goBack() {
    this.navController.back();
  }
}
