import { Injectable } from '@angular/core';
import { differenceInMinutes, formatISO } from 'date-fns';
import { environment } from '../../environments/environment';
import { SentryLoggerService } from './sentry-logger.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class ConsoleLoggerService {
  constructor(
    private sentryLogger: SentryLoggerService,
    private storeService: StoreService
  ) {}

  async init() {
    if (!(environment.env === 'live' && environment.debug === false)) {
      return;
    }

    this.saveLogsInArray();
  }
  getTimeStamp = () =>
    formatISO(new Date(), {
      format: 'extended',
      representation: 'complete',
    }).toString();

  async saveLogsInArray() {
    const pushData = (
      level: 'info' | 'warn' | 'error' | 'exception' | 'log',
      ...args: any[]
    ) => {
      this.storeService.consoleLogData.push([
        this.getTimeStamp(),
        `LEVEL: ${level}`,
        ...args,
      ]);
      this.storeService.consoleLogDataUpdatedIndicator.next(true);
    };

    console.log = (...args: any[]) => pushData('log', ...args);
    console.error = (...args: any[]) => pushData('error', ...args);

    this.storeService.consoleLastSyncAt = null;
    this.storeService.consoleLogDataUpdatedIndicator.subscribe((_) => {
      const difference = differenceInMinutes(
        +new Date(this.getTimeStamp()),
        +new Date(this.storeService.consoleLastSyncAt || this.getTimeStamp())
      );
      // Getting length in case we read something and other operations meanwhile try to write in dataArray. We don't want to erase new ones.
      const logDataArrayLength = this.storeService.consoleLogData.length;
      if (logDataArrayLength > 25 || difference > 5) {
        this.saveToSentry();
      }
    });
  }

  saveToSentry() {
    const logDataArrayLength = this.storeService.consoleLogData.length;
    this.sentryLogger.saveLogs({
      data: JSON.stringify(
        this.storeService.consoleLogData.slice(0, logDataArrayLength)
      ),
    });
    this.storeService.consoleLogData.splice(0, logDataArrayLength);
    this.storeService.consoleLastSyncAt = this.getTimeStamp();
  }
}
