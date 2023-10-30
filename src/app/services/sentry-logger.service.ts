import { Injectable } from '@angular/core';
import * as Sentry from '@sentry/browser';
import { first } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { StoreService } from './store.service';

if (environment.env === 'live' && environment.debug === false) {
  Sentry.init({
    dsn:
      'https://9567b6a66af540dfad2806fa9c3ef5f6@o321741.ingest.sentry.io/1816589',
    ignoreErrors: [
      `Can't execute code from freed script`,
      /SecurityError\: DOM Exception 18$/,
      'Non-Error exception captured',
    ],
  });
}

export enum ErrorContextEnum {}
@Injectable({ providedIn: 'root' })
export class SentryLoggerService {
  constructor(private storeService: StoreService) {}
  async init() {
    if (environment.debug === true) {
      return;
    }
    this.storeService.deviceInfo
      .pipe(first((info) => !!(info && info.websiteVersion && info.platform)))
      .subscribe((deviceInfo) => {
        Sentry.configureScope((scope) => {
          scope.setTags({
            ...deviceInfo,
          });
        });
      });
    this.storeService.loggedInUser
      .pipe(first((currentUser) => !!(currentUser && currentUser.uid)))
      .subscribe((user) => {
        const { fullName, email } = user;
        Sentry.configureScope((scope) => {
          scope.setUser({
            name: fullName,
            email,
          });
        });
      });
  }

  async logError({ error }: { type?: string; error: any }) {
    if (environment.debug === true) {
      return;
    }
    Sentry.captureException(error);
  }

  async saveLogs({ data, eventType }: { data: string; eventType?: string }) {
    if (environment.debug === true) {
      return;
    }
    const user = this.storeService.loggedInUser.value;
    const userId = user?.uid;
    const deviceUUID = this.storeService.deviceInfo.getValue().uuid;
    Sentry.setExtra('data', data);
    Sentry.captureMessage(
      `${
        eventType ? `EVENT TYPE: ${eventType}` : ''
      } --- Log for user ${JSON.stringify({
        uuid: deviceUUID,
        userId,
      })}`
    );
  }
}
