import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonContent, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { IMessage } from '../../models';
import { ChatPageData } from '../../models/app-data.model';
import { ChatService } from '../../services/chat.service';
import { StoreService } from '../../services/store.service';
import PageObserverComponent from '../../utils/component-observer.util';

export type IChatType = 'withGreenDay' | 'global' | 'withMerchant' | 'withUser';
@Component({
  selector: 'user-portal-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPageComponent
  extends PageObserverComponent
  implements OnInit, AfterViewChecked {
  @ViewChild('content') content: IonContent;
  isSearchEmpty = true;
  messagesToSearchFrom: Observable<IMessage[]>;
  roomId: string;
  pageConfig: ChatPageData;
  constructor(
    private cdr: ChangeDetectorRef,
    public chatService: ChatService,
    private navController: NavController,
    public storeService: StoreService
  ) {
    super();
  }

  async ngOnInit() {
    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.chatPage;
      this.cdr.detectChanges();
    });
    this.observe(this.storeService.greenConciergeChatMessageStream, (_) => {
      this.roomId = this.storeService.greenConciergeChatActiveRoomId;
    });
  }

  async onSearchTermChange(event: any) {
    const val = event.target.value;
    if (val && val.trim() !== '') {
      this.isSearchEmpty = false; // Toggling value of isSearchEmpty helps us in displaying the serach UI and messages within in.
      // Inverse value.
      const messages = await this.storeService.greenConciergeChatMessageStream
        .pipe(take(1))
        .toPromise();

      this.messagesToSearchFrom = new Observable((observer) => {
        observer.next(
          messages.filter((message) => {
            return (
              message.description.toLowerCase().indexOf(val.toLowerCase()) > -1
            );
          })
        );
      });
    } else {
      // As soon as user clears the input, it turns live chat is brought back
      this.isSearchEmpty = true;
    }
    this.cdr.detectChanges();
  }

  /**
   * Once the view has been established, send user to the bottom of chatbox
   */
  ngAfterViewChecked() {
    if (this.isSearchEmpty) {
      this.content.scrollToBottom(50);
    }
  }

  async onComment(comment: string) {
    if (!(comment && comment.length)) {
      return;
    }

    this.chatService.sendMessage({ comment, roomId: this.roomId });
  }

  onBackButtonPress() {
    this.chatService.clearNewMessagesCounter();
  }
  goBack() {
    this.navController.back();
  }
}
