import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { nanoid } from 'nanoid';
import { environment } from '../../environments/environment';
import { StoreService } from '../services/store.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storeService: StoreService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // return of(undefined);
    const uid = (this.storeService.authFirebaseUser.data.value || {}).uid;

    const refreshToken = nanoid();
    const { websiteVersion, platform, uuid, appBuild } =
      this.storeService.deviceInfo.getValue() || {};

    const body = { ...req.body };
    if (req.url.includes(environment.serverUrl)) {
      body.deviceInfo = { websiteVersion, platform, uuid, appBuild };
      body.sessionId = this.storeService.userSessionId || null;
    }

    const authReq = req.clone({
      setHeaders: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json; charset=utf-8',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Accept: 'application/json',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `UID ${uid || ''} RefreshToken ${refreshToken}`,
      },
      body,
    });

    return next.handle(authReq);
  }
}
