import { Injectable, ErrorHandler } from '@angular/core';
import { environment } from '../../environments/environment';
import { SentryLoggerService } from './sentry-logger.service';

@Injectable({ providedIn: 'root' })
export class AppErrorHandlerService implements ErrorHandler {
  constructor(private sentryLoggerService: SentryLoggerService) {}
  handleError(error: any): void {
    if (!(environment.debug === false && environment.env === 'live')) {
      // ignore web errors for capacitor plugins
      if (error?.originalStack?.toString()?.includes('web implementation')) {
        return;
      }

      console.error('user-portal-error', error);
    } else {
      this.sentryLoggerService.logError({ type: 'user-portal-error', error });
    }
  }
}
