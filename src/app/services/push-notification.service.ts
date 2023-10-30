import { Injectable } from '@angular/core';
import {
  Plugins,
  PushNotification,
  PushNotificationActionPerformed,
  PushNotificationToken,
} from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { CustomGoogleTagManagerService } from './custom-google-tag-manager.service';
import { distinctUntilChanged, filter, first, timeout } from 'rxjs/operators';
import { PageRoutes } from '../constants';
import { gtmEventNames } from '../models/gtm-event.model';
import { INotificationDataEntity } from '../models/INotification';
import { AnalyticService } from './analytic.service';
import { ApiService } from './api.service';
import { AppService } from './app.service';
import { StoreService } from './store.service';
@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(
    private apiService: ApiService,
    private analytics: AnalyticService,
    private navController: NavController,
    private storeService: StoreService,
    private appService: AppService,
    private gtmService: CustomGoogleTagManagerService
  ) {}

  async listenForToken() {
    this.storeService.pushNotificationToken
      .pipe(
        filter((token) => !!token),
        distinctUntilChanged()
      )
      .subscribe(async (token) => {
        try {
          const deviceInfo = await this.storeService.deviceInfo
            .pipe(
              first((t) => !!t),
              timeout(5000)
            )
            .toPromise();
          this.apiService.saveDeviceInfo({
            data: {
              token,
              deviceInfo,
            },
          });
        } catch (error) {}
        this.analytics.logEvent(
          this.storeService.analyticFacebookEvents
            .EVENT_NAME_PUSH_TOKEN_OBTAINED,
          {
            token,
          }
        );
      });
  }

  async listenForUser() {
    this.storeService.loggedInUser
      .pipe(
        filter((currentUser) => !!(currentUser && currentUser.uid)),
        distinctUntilChanged()
      )
      .subscribe(async (_) => {
        try {
          const token = await this.storeService.pushNotificationToken
            .pipe(
              first((t) => !!t),
              timeout(5000)
            )
            .toPromise();
          const deviceInfo = await this.storeService.deviceInfo
            .pipe(
              first((d) => !!d),
              timeout(5000)
            )
            .toPromise();
          this.apiService.saveDeviceInfo({
            data: {
              token,
              deviceInfo,
            },
          });
        } catch (error) {}
      });
  }

  async listenForNotification() {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { PushNotifications } = Plugins;
    PushNotifications.requestPermission().then((result) => {
      if (result.granted) {
        PushNotifications.register();
        try {
          this.gtmService.recordEvent({
            event: gtmEventNames.allowNotificationPromptAccepted,
            accessGranted: true,
          });
        } catch (error) {}
      } else {
        try {
          this.gtmService.recordEvent({
            event: gtmEventNames.allowNotificationPromptRejected,
            accessGranted: false,
          });
        } catch (error) {}
      }
    });
    PushNotifications.addListener(
      'registration',
      async (token: PushNotificationToken) => {
        if (!token.value) {
          return;
        }

        this.storeService.pushNotificationToken.next(token?.value);
      }
    );

    PushNotifications.addListener('registrationError', (error: any) => {});

    PushNotifications.addListener(
      'pushNotificationReceived',
      (receivedNotification: PushNotification) => {
        console.log({ pushNotificationReceived: receivedNotification });
        const parsedData = JSON.parse(
          receivedNotification?.data?.customData || '{}'
        ) as INotificationDataEntity;
        if (this.appService.isObjectEmpty(parsedData)) {
          return;
        }
        console.log({ pushNotificationReceived: parsedData });

        const uniqueMessageId = parsedData.uniqueMessageId;
        this.apiService.updateNotificationStatus({
          openMode: 'receivedWhileAppWasOpen',
          uniqueMessageId,
        });

        try {
          this.gtmService.recordEvent({
            event: gtmEventNames.notificationReceivedWhileAppOpen,
            notificationTitle: receivedNotification.title,
            notificationBody: receivedNotification.body,
          });
        } catch (error) {}
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (action: PushNotificationActionPerformed) => {
        console.log(`push action performed: `, action);

        const parsedData = JSON.parse(
          action?.notification?.data?.customData || '{}'
        ) as INotificationDataEntity;
        if (this.appService.isObjectEmpty(parsedData)) {
          return;
        }

        try {
          this.gtmService.recordEvent({
            event: gtmEventNames.notificationReceivedWhileAppOpen,
            notificationTitle: action.notification.title,
            notificationBody: action.notification.body,
          });
        } catch (error) {}

        console.log({ pushNotificationActionPerformed: parsedData });
        const uniqueMessageId = parsedData.uniqueMessageId;
        this.apiService.updateNotificationStatus({
          openMode: 'tappedOnNotificationToOpenIt',
          uniqueMessageId,
        });
        this.handleNotificationClickedRequest({ data: parsedData });
      }
    );
  }

  private handleNotificationClickedRequest({
    data,
  }: {
    data: INotificationDataEntity;
  }) {
    const { action } = data || {};
    if (
      !(
        action === 'goToPage' ||
        action === 'goToMarketTags' ||
        action === 'filterByTags' ||
        action === 'goToSearchPage'
      )
    ) {
      return;
    }
    this.navController
      .navigateBack(PageRoutes.fullUrls.shoppingCart)
      .then((_) => {
        setTimeout(() => {
          this.navController.navigateForward(data.link, {
            state: data?.data,
          });
        }, 500);
      });
  }
}
