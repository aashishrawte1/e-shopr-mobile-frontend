import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import firebase from 'firebase/app';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { PageRoutes } from '../constants';
import {
  ActiveFilterItem,
  ArticleEntity,
  IAppStoreResult,
  ILoggedInUser,
  IMessage,
  IProductResult,
  IRangeTracker,
  IRegistrationWelcomeQuiz,
  IShippingAddressEntity,
  UrlData,
} from '../models';
import { AppBanner, AppData } from '../models/app-data.model';
import { CoinActionItem } from '../models/coin-action-list.model';
import { FilteredDeviceInfo } from '../models/filtered-device-info.model';
import { IOrderResult } from '../models/IGetOrdersResponse';
import { IReferrerNotificationResponse } from '../models/INotification';
import { IMerchantStore } from '../models/MerchantStore.interface';
import { AnalyticTimeStamp } from '../models/user-activity-analytics.model';
import { ReferralCodeClaimStatus } from '../models/user-coin-activity.model';
import {
  IBarteringChatListDisplayItem,
  IBarteringMessageExtra,
  IBarteringProductItem,
} from '../pages/bartering/bartering.model';
import { SpinWheelReward } from '../pages/playground/spin-the-wheel/wheel-reward.interface';
import { SubscriptionManager } from '../utils/subscription-manager.util';
import { RewardTracker } from './coin.service';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { Storage } = Plugins;
const useSubject = <T>(value: T = null): BehaviorSubject<T> => {
  return new BehaviorSubject<T>(value);
};

export const storageKeys = {
  authFirebaseUser: 'authFirebaseUser',
};

@Injectable({ providedIn: 'root' })
export class StoreService {
  // ITEMS TO SAVE IN LOCAL STORAGE
  authFirebaseUser = this.initLocalDB({
    data: useSubject<firebase.User>(null),
    storageKey: storageKeys.authFirebaseUser,
  });
  shoppingCart = useSubject<IMerchantStore>();

  // ANALYTICS SERVICE
  analyticFacebookEvents = this.facebook.EVENTS;
  previousPageViewTimeStamp = {} as AnalyticTimeStamp;
  currentPageViewTimeStamp = {} as AnalyticTimeStamp;
  // APP CONFIG SERVICE
  readonly firebaseAppConfigPath = 'appConfig';
  downtimeComponentRef: HTMLIonModalElement;
  activeDowntime = false;
  readonly json = new AppData();
  // APP EVENT SERVICE
  appResumed = useSubject<boolean>(undefined);
  appPaused = useSubject<boolean>(undefined);
  appIsReady = useSubject<string>(undefined);
  appBackButtonPress = useSubject<boolean>(null);

  // APP INITIALIZER
  appInitializationComplete = useSubject<boolean>(false);
  initialProductFetchRangeTracker: IRangeTracker;

  // ARTICLE SERVICE
  articles = useSubject<ArticleEntity[]>(null);

  // AUTH SERVICE
  authLoader: HTMLIonLoadingElement;

  authGenericErrorMessageWhenCanNotLoginUser = `Hmm. Its weird why we can't log you in today. Can you please try log in using email?`;

  // CHAT SERVICE
  readonly greenConciergeRootKey = 'chatBox';
  greenConciergeChatMessageStream = useSubject<IMessage[]>([]);
  greenConciergeChatNewMessageCounterStream = useSubject<number>(0);
  greenConciergeChatMessagesRef: any;
  public greenConciergeChatNewMessageNotifierStream = useSubject<void>(null);
  public greenConciergeChatActiveRoomId: string;

  greenConciergePaths = {
    users: `${this.greenConciergeRootKey}/users`,
    chats: `${this.greenConciergeRootKey}/chats`,
    members: `${this.greenConciergeRootKey}/members`,
    messages: `${this.greenConciergeRootKey}/messages`,
  };
  greenDayUserUID: string;
  greenConciergeChatOtherUserDetailMap: {
    [key: string]: {
      uid: string;
      name: string;
      avatar: string;
    };
  } = {};

  // Bartering Chat
  readonly barteringChatRoot = 'barteringChat';
  readonly barteringChatPaths = {
    messages: `${this.barteringChatRoot}/messages`,
    chatRooms: `${this.barteringChatRoot}/chatRooms`,
  };
  barteringChatRoomList = useSubject<Array<IBarteringChatListDisplayItem>>(
    null
  );
  barteringMessages: {
    [key: string]: BehaviorSubject<Array<IBarteringMessageExtra>>;
  } = {};
  // COIN SERVICE
  coinDailyLoginRewardDateFormat = 'yyyy-MMMM-dd';
  coinFirebaseActivityUrl = `${environment.firebaseConfig.databaseURL}/coinActivity`;
  coinClaimsTracker: RewardTracker = {
    productViewTracker: new BehaviorSubject({}),
    dailyLoginRewardTracker: new BehaviorSubject(null),
    referralCodeClaimTracker: new BehaviorSubject(null),
  };
  coinCounterStream = useSubject<{
    value: number;
    count: number;
    formattedCoinCount: string;
  }>(null);
  coinSubTracker = new SubscriptionManager();

  // CONSOLE LOGGER SERVICE
  consoleLogData = [];
  consoleLogDataUpdatedIndicator: Subject<boolean> = new Subject();
  consoleLastSyncAt: any;

  // DEVICE INFO SERVICE
  deviceInfo = useSubject<FilteredDeviceInfo>(null);

  // DIMENSION SERVICE
  tabHeight: number;
  headerHeight: any;

  // PRODUCT FETCHER SERVICE
  searchResultCache: {
    searchTerm: string;
    hasMoreProducts: boolean;
    lastRangeKey: string;
    range: {
      [key: string]: IProductResult[];
    };
  }[] = [];
  productJustForYouProductsAvailabilityTracker = new BehaviorSubject<boolean>(
    false
  );
  merchantList = new BehaviorSubject<ActiveFilterItem[]>(null);

  // PUSH NOTIFICATION SERVICE
  pushNotificationDetail: IReferrerNotificationResponse;
  pushNotificationToken = useSubject<string>(null);

  // REFERRAL CODE SERVICE
  referralFirebaseCoinActivityUrl = `${environment.firebaseConfig.databaseURL}/coinActivity`;
  referralCodeClaimStatus = useSubject<ReferralCodeClaimStatus>(null);
  userReferralCode = useSubject<string>(null);

  // ROUTING STATE SERVICE
  readonly routingStateDefaultRoute = {
    url: PageRoutes.fullUrls.home,
    params: {},
  };
  routingStatePageNavigationUrlStackStream = useSubject<UrlData[]>(null);
  routingStatePreviousUrlStream = useSubject<UrlData>(null);
  routingStateCurrentUrlStream = useSubject<UrlData>(null);

  // SENTRY LOGGER SERVICE
  sentryLogRecord: string[] = [];

  // USER SESSION SERVICE
  userSessionId: string;

  // USER PROFILE SERVICE
  loggedInUser = useSubject<ILoggedInUser>(null);
  appCurrencyFormat: string;

  // WEBSITE RELOADER SERVICE
  websiteLastReleaseJSDate: Date = null;
  // REGISTRATION WELCOME QUIZ
  registrationWelcomeQuiz: IRegistrationWelcomeQuiz = {
    startAt: '',
    endAt: '',
    activePage: '',
    responses: {
      q1: {
        response: '',
      },
      q2: {
        response: '',
      },
    },
  };
  welcomeQuizCompletedEventStream = useSubject<boolean>(false);
  coinsActionList = useSubject<CoinActionItem[]>();
  myOrders = useSubject<IOrderResult[]>();

  shippingAddress = useSubject<IShippingAddressEntity>();
  appShareLinks = useSubject<IAppStoreResult[]>();
  banners = useSubject<AppBanner[]>();
  wheelSpin = useSubject<{
    spinCount: number;
    date: string;
    rewards: SpinWheelReward[];
  }>();
  homePageCategoryProducts = useSubject<Array<IProductResult[]>>([]);
  reloadWebsiteStream = useSubject<boolean>(false);

  // Bartering
  barteringProductByUser = useSubject<IBarteringProductItem[]>();

  matchedProducts = useSubject<{
    [key: string]: IBarteringProductItem[];
  }>();

  relevantProductsMap = useSubject<{
    [key: string]: IBarteringProductItem[];
  }>();

  constructor(private facebook: Facebook) {}

  initLocalDB<T>({
    storageKey,
    data,
  }: {
    storageKey?: string;
    data: BehaviorSubject<T>;
  }) {
    const next = async (value: T): Promise<void> => {
      if (storageKey) {
        await Storage.set({ key: storageKey, value: JSON.stringify(value) });
      }
      data.next(value as any);
    };

    const getValue = async (): Promise<T> => {
      if (!storageKey) {
        return data.getValue();
      }

      if (!this.isObjectEmpty(data.getValue())) {
        return data.getValue();
      } else {
        const storeData = ((await Storage.get({
          key: storageKey,
        })) as unknown) as T;
        const value = JSON.parse((storeData as any).value) as T;

        if (value) {
          next(value);
        }
        return value;
      }
    };

    return {
      data,
      next,
      getValue,
    };
  }

  async init() {
    // first get last values of store items
    for (const key of Object.keys(storageKeys)) {
      await this[key].getValue();
    }
    await this.clearStorage();
    return true;
  }

  async getKeyListInDB() {
    return (await Storage.keys()).keys;
  }

  // Must only be called by AppCenter
  async clearStorage() {
    // Have to safely remove items.
    for (const key of Object.keys(storageKeys)) {
      if ([storageKeys.authFirebaseUser].findIndex((k) => k === key) === -1) {
        await Storage.set({ key, value: null });
      }
    }
  }

  async toString() {
    // return (await Storage.keys()).keys.map(
    //   async (key) => await Storage.get({ key })
    // );
  }

  isObjectEmpty(obj: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }
}
