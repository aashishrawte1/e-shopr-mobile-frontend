import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class AppEventService {
  constructor(private platform: Platform, private storeService: StoreService) {}

  init() {
    this.platform.resume.subscribe((_) => {
      this.storeService.appResumed.next(true);
    });
    this.platform.pause.subscribe((_) => {
      this.storeService.appPaused.next(true);
    });
    this.platform.ready().then((plt: string) => {
      this.storeService.appIsReady.next(plt);
    });
    this.platform.backButton.subscribe((_) => {
      this.storeService.appBackButtonPress.next(true);
    });
  }

  onAppResume(): Observable<boolean> {
    return this.storeService.appResumed.pipe(filter((val) => val === true));
  }

  onAppPaused(): Observable<boolean> {
    return this.storeService.appPaused.pipe(filter((val) => val === true));
  }

  onAppReady(): Observable<string> {
    return this.storeService.appIsReady.pipe(
      filter((event) => !!event),
      take(1)
    );
  }

  onBackButtonPress(): Observable<boolean> {
    return this.storeService.appBackButtonPress.pipe(
      filter((val) => val === true)
    );
  }
}
