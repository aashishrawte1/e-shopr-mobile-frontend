import { Injectable } from '@angular/core';
import { AngularFireDatabase, SnapshotAction } from '@angular/fire/database';
import { parseISO } from 'date-fns';
import {
  distinctUntilChanged,
  filter,
  map,
  throttleTime,
} from 'rxjs/operators';
import { ILoggedInUser } from '../../models';
import { ApiService } from '../../services/api.service';
import { AppService } from '../../services/app.service';
import { StoreService } from '../../services/store.service';
import { useSubject } from '../../utils/useSubject';
import {
  IBarteringChatListDisplayItem,
  IBarteringChatListItemFB,
  IBarteringMessageExtra,
  IBarteringMessageFB,
} from './bartering.model';

@Injectable({ providedIn: 'root' })
export class BarteringChatService {
  constructor(
    private db: AngularFireDatabase,
    private storeService: StoreService,
    private apiService: ApiService,
    private appService: AppService
  ) {}

  async init() {
    this.getChatRoomList();
  }

  async getChatRoomList() {
    const path = `${this.storeService.barteringChatPaths.chatRooms}`;

    this.storeService.loggedInUser
      .pipe(
        filter((user) => !!(user && user.uid)),
        distinctUntilChanged(
          (prevUser: ILoggedInUser, currentUser: ILoggedInUser) =>
            prevUser?.uid === currentUser?.uid
        )
      )
      .subscribe((user) => {
        const userUid = user.uid;

        this.db
          .list<IBarteringChatListItemFB>(path, (query) =>
            query.orderByChild(`members/${userUid}/uid`).equalTo(userUid)
          )
          .snapshotChanges()
          .pipe(
            map((changes: SnapshotAction<IBarteringChatListItemFB>[]) =>
              changes
                .map((c: { payload: { key: any; val: () => any } }) =>
                  this.structureChatItemForDisplay(c.payload.val())
                )
                .sort(
                  (a, b) =>
                    +parseISO(a.lastMessageTime) - +parseISO(b.lastMessageTime)
                )
            )
          )
          .subscribe((chatRoomList) => {
            this.storeService.barteringChatRoomList.next(chatRoomList);
          });
      });
  }

  structureChatItemForDisplay(
    item: IBarteringChatListItemFB
  ): IBarteringChatListDisplayItem {
    const currentUserUid = this.storeService.loggedInUser.value.uid;
    const displayItem: IBarteringChatListDisplayItem = {
      lastMessage: item.lastMessage.message,
      lastMessageTime: this.appService.getChatDisplayTime(
        item.lastMessage.time
      ),
      barteringLevel: item.barteringLevel,
      isLastMessageByCurrentUser:
        item.lastMessage.author.uid === currentUserUid,
      partiesInvolved: [],
      allProductIds: Object.keys(item.productsInfo).sort().join(','),
    };

    let indexTracker = 0;
    for (const key of Object.keys(item.members)) {
      // all keys are userID
      const pInfo = Object.values(item.productsInfo).find((p) =>
        p.image.includes(key)
      );
      displayItem.partiesInvolved[indexTracker++] = {
        memberName: item.members[key].name,
        profilePicture: item.members[key].avatarUrl,
        productImage: pInfo.image,
        productTitle: pInfo.title,
        memberId: key,
      };
    }

    // find the item that is from this user and make it first item.
    const currentUserIndex = displayItem.partiesInvolved.findIndex(
      (p) => p.memberId === currentUserUid
    );
    const currentUserProductMetadata =
      displayItem.partiesInvolved[currentUserIndex];
    displayItem.partiesInvolved.splice(currentUserIndex, 1);
    // now add this current user in front
    displayItem.partiesInvolved.unshift(currentUserProductMetadata);

    return displayItem;
  }

  async subscribeToChatRoomMessages(ids: Array<string>) {
    const key = this.getChatroomKey(ids);

    const waitUntilMessagePresent = (path) => {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          try {
            console.log('trying to read message at path', path);
            this.db.database
              .ref(path)
              .once('value')
              .then((value) => {
                console.log('got value at path ', path);
                if (value.hasChildren()) {
                  clearInterval(interval);
                  resolve(true);
                }
              });
          } catch (error) {}
        }, 2000);
      });
    };

    if (!(key in this.storeService.barteringMessages)) {
      this.storeService.barteringMessages[key] = useSubject<
        Array<IBarteringMessageExtra>
      >([]);
      const path = `${this.storeService.barteringChatPaths.messages}/${key}`;

      await waitUntilMessagePresent(path);
      this.db
        .list<IBarteringMessageFB>(path)
        .valueChanges(['child_added'])
        .pipe(
          throttleTime(1000),
          filter((val) => !!(val && val.length)),
          map((messages: Array<IBarteringMessageExtra>) =>
            messages
              .sort((a, b) => +parseISO(a.time) - +parseISO(b.time))
              .map((m) => ({
                ...m,
                displayTime: this.appService.getChatDisplayTime(m.time),
              }))
          )
        )
        .subscribe((messages) =>
          this.storeService.barteringMessages[key].next(messages)
        );
    }

    return this.storeService.barteringMessages[key];
  }

  sendMessage({
    productIds,
    message,
  }: {
    productIds: Array<string>;
    message: string;
  }) {
    this.apiService.postBarteringMessage({ productIds, message });
  }

  getChatroomKey(productIds: Array<string>) {
    return productIds.sort().join('__');
  }
}
