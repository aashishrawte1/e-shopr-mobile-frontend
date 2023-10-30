import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { formatDistanceToNow, parseISO } from 'date-fns';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  first,
  throttleTime,
} from 'rxjs/operators';
import { PageRoutes } from '../constants';
import { IMessage, IProductResult } from '../models';
import { ApiService } from './api.service';
import { AppService } from './app.service';
import { RoutingStateService } from './routing-state.service';
import { StoreService } from './store.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(
    private db: AngularFireDatabase,
    private apiService: ApiService,
    private routingStateService: RoutingStateService,
    private storeService: StoreService,
    private appService: AppService
  ) {}

  async init() {
    this.storeService.greenDayUserUID = await (
      await this.db
        .object<string>(
          `${this.storeService.firebaseAppConfigPath}/greendayUID`
        )
        .query.once('value')
    ).val();
    this.storeService.loggedInUser
      .pipe(
        filter((currentUser) => !!(currentUser?.uid && currentUser?.fullName)),
        distinctUntilChanged(
          (prevUser, currentUser) => prevUser?.uid === currentUser?.uid
        ),
        throttleTime(10000)
      )
      .subscribe(async (currentUser) => {
        this.populateChatDataForCurrentUser();
      });
  }

  populateChatDataForCurrentUser() {
    this.clearChatData();
    this.populateRoomList();
  }

  async populateRoomList() {
    const currentUser = this.storeService.loggedInUser.value;
    if (!(currentUser && currentUser.uid)) {
      return;
    }

    const membershipObject = (
      await this.db
        .list<{ [key: string]: boolean }[]>(
          `${this.storeService.greenConciergePaths.members}`,
          (ref) => ref.orderByChild(currentUser.uid).equalTo(true)
        )
        .query.once('value')
    ).val();

    let chatRooms = Object.keys(membershipObject || {}).map((key) => ({
      key,
      ...membershipObject[key],
    }));

    if (!(chatRooms && chatRooms.length)) {
      await this.db
        .object(
          `${this.storeService.greenConciergePaths.users}/${currentUser.uid}`
        )
        .set({
          avatar: currentUser?.avatarUrl || '',
          name: currentUser.fullName,
          email: currentUser.email,
        });

      chatRooms = await this.createNewRoom(); // do this only for user-portal
    }

    if (!this.storeService.greenConciergeChatActiveRoomId) {
      this.storeService.greenConciergeChatActiveRoomId = chatRooms[0].key;
    }

    this.populateMessagesForRoomId({
      roomId: this.storeService.greenConciergeChatActiveRoomId,
    });
  }

  async getOtherUserUid({
    chatKey,
    currentUserUid,
  }: {
    chatKey: string;
    currentUserUid: string;
  }) {
    const members = await (
      await this.db
        .object(`${this.storeService.greenConciergePaths.members}/${chatKey}`)
        .query.once('value')
    ).val();
    const otherUserUid = Object.keys(members).find((m) => m !== currentUserUid);
    return otherUserUid;
  }

  async getOtherUser({
    chatKey,
    currentUserUid,
  }: {
    chatKey: string;
    currentUserUid: string;
  }) {
    let profile = this.storeService.greenConciergeChatOtherUserDetailMap[
      chatKey
    ];
    if (profile && profile.uid) {
      return profile;
    }

    const otherUserUid = await this.getOtherUserUid({
      chatKey,
      currentUserUid,
    });
    profile = (
      await this.db
        .object(
          `${this.storeService.greenConciergePaths.users}/${otherUserUid}`
        )
        .query.once('value')
    ).val();

    this.storeService.greenConciergeChatOtherUserDetailMap[chatKey] = {
      avatar: profile.avatar,
      name: profile.name,
      uid: otherUserUid,
    };
    return this.storeService.greenConciergeChatOtherUserDetailMap[chatKey];
  }

  async populateMessagesForRoomId({ roomId }: { roomId: string }) {
    this.storeService.greenConciergeChatActiveRoomId = roomId;
    this.db
      .list<IMessage>(
        `${this.storeService.greenConciergePaths.messages}/${roomId}`,
        (ref) => ref.orderByChild('timestamp')
      )
      .valueChanges(['child_added'])
      .pipe(debounceTime(2000))
      .subscribe(async (messages) => {
        messages = messages.map((m) => ({
          ...m,
          timestamp: +new Date(+m.timestamp) || +parseISO(m.timestamp + ''),
          displayTime: this.appService.getChatDisplayTime(
            m.timestamp?.toString()
          ),
        }));
        messages.sort((a, b) => {
          if (a.timestamp < b.timestamp) {
            return -1;
          }
          if (a.timestamp > b.timestamp) {
            return 1;
          }
          return 0;
        });

        this.storeService.greenConciergeChatMessageStream.next(messages);
      });

    this.storeService.greenConciergeChatMessageStream.subscribe((val) =>
      this.storeService.greenConciergeChatNewMessageNotifierStream.next()
    );
    this.db.database
      .ref(`${this.storeService.greenConciergePaths.messages}/${roomId}`)
      .on('child_added', async (snap) => {
        const currentUrl = await this.routingStateService.getCurrentUrl();
        if (currentUrl.url.includes(`${PageRoutes.fullUrls.chat}`)) {
          this.storeService.greenConciergeChatNewMessageCounterStream.next(0);
          return;
        }
        if (snap.exists()) {
          this.storeService.greenConciergeChatNewMessageCounterStream.next(
            snap?.val()?.length
          );
        }
      });
  }

  async clearNewMessagesCounter() {
    return this.storeService.greenConciergeChatNewMessageCounterStream.next(0);
  }

  async sendMessage({
    comment,
    roomId,
    sendEmail = true,
    chatType,
  }: {
    comment: string;
    roomId: string;
    sendEmail?: boolean;
    chatType?:
      | 'registration_welcome_message'
      | 'greenday_initiated_product_query_message'
      | 'green_concierge_user_message';
  }) {
    if (!(comment && roomId)) {
      return;
    }

    const currentUser = this.storeService.loggedInUser.value;
    if (!currentUser) {
      return;
    }

    const timestamp = +new Date();

    const receiverUid = (
      await this.getOtherUser({
        chatKey: roomId,
        currentUserUid: currentUser.uid,
      })
    ).uid;

    const message: IMessage = {
      description: comment,
      timestamp,
      name: currentUser.fullName,
      senderUid: currentUser.uid,
      receiverUid,
    };

    const chatObject = {
      lastMessage: comment,
      timestamp,
      type: 'single',
      key: roomId,
      receiverUid: currentUser.uid,
      senderUid: currentUser.uid,
    };

    if (chatType === 'greenday_initiated_product_query_message') {
      const receiver = message.senderUid;
      const sender = message.receiverUid;
      message.senderUid = sender;
      message.receiverUid = receiver;
      chatObject.senderUid = sender;
      chatObject.receiverUid = receiver;
    }

    this.db
      .list(`${this.storeService.greenConciergePaths.messages}/${roomId}`)
      .push(message);
    this.db
      .object(`${this.storeService.greenConciergePaths.chats}/${roomId}`)
      .update(chatObject);

    if (sendEmail) {
      this.sendEmailToGreenDay({
        chatType: 'green_concierge_user_message',
        message: comment,
      });
    }
  }

  clearChatData() {
    this.storeService.greenConciergeChatMessageStream.next([]);
    this.storeService.greenConciergeChatActiveRoomId = null;
  }

  async createNewRoom(): Promise<{ key: string }[]> {
    const roomId = this.db.createPushId();
    this.storeService.greenConciergeChatActiveRoomId = roomId;
    const currentUser = this.storeService.loggedInUser.value;
    if (!currentUser) {
      return;
    }
    await this.db
      .object(`${this.storeService.greenConciergePaths.members}/${roomId}`)
      .update({
        [currentUser.uid]: true,
        [this.storeService.greenDayUserUID]: true,
      });

    return [{ key: roomId }];
  }

  async initiateChatForAction({
    type,
    product,
  }: {
    type:
      | 'registration_welcome_message'
      | 'greenday_initiated_product_query_message';
    product?: IProductResult;
  }) {
    const currentUser = this.storeService.loggedInUser.value;
    if (!currentUser) {
      return;
    }

    if (!this.storeService.greenConciergeChatActiveRoomId) {
      this.populateChatDataForCurrentUser();
    }

    await this.storeService.greenConciergeChatMessageStream
      .pipe(first((d) => !!(d && d.length)))
      .toPromise();
    if (!this.storeService.greenConciergeChatActiveRoomId) {
      return;
    }
    if (!type) {
      return;
    }

    let message = '';
    if (type === 'registration_welcome_message') {
      const firstName = currentUser.fullName.replace(
        /(\w)(\w*)/g,
        (g0, g1, g2) => {
          return g1.toUpperCase() + g2.toLowerCase();
        }
      );

      message = this.storeService.json.pageConfig.value.componentData.chatPage.registrationWelcomeMessage.replace(
        /{{first_name}}/gi,
        firstName
      );
    } else if (type === 'greenday_initiated_product_query_message') {
      message = `<img src="${
        product.media[0].link
      }"/><br />${this.storeService.json.pageConfig.value.componentData.chatPage.productQueryMessage.replace(
        /{{product_title}}/gi,
        product.title
      )}`;
    }

    this.sendMessage({
      comment: message,
      roomId: this.storeService.greenConciergeChatActiveRoomId,
      sendEmail: false,
      chatType: type,
    });

    this.sendEmailToGreenDay({ chatType: type, product });
  }

  sendEmailToGreenDay({
    chatType,
    product,
    message,
  }: {
    chatType:
      | 'registration_welcome_message'
      | 'greenday_initiated_product_query_message'
      | 'green_concierge_user_message';
    product?: IProductResult;
    message?: string;
  }) {
    this.apiService.sendMessageForGreenConcierge({
      chatType,
      productId: product?.uniqueId,
      message,
    });
  }
}
