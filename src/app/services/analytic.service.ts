import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import { filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { PageRoutes } from '../constants';
import { endpoints } from '../constants/endpoints';
import { ApiResponse } from '../models';
import { AnalyticData } from '../models/user-activity-analytics.model';
import { AppService } from './app.service';
import { RequestService } from './request.service';
import { RoutingStateService } from './routing-state.service';
import { StoreService } from './store.service';
export type CustomEventTypes = 'PAGE_VIEW_EVENT';
@Injectable({
  providedIn: 'root',
})
export class AnalyticService {
  constructor(
    private facebook: Facebook,
    private appService: AppService,
    private requestService: RequestService,
    private routingStateService: RoutingStateService,
    private storeService: StoreService
  ) {}

  async init() {
    this.routingStateService.currentRoute
      .pipe(
        filter(({ url }) => url.includes(PageRoutes.fullUrls.productDetail))
      )
      .subscribe(({ url }) => {
        this.logEvent(
          this.storeService.analyticFacebookEvents.EVENT_NAME_VIEWED_CONTENT,
          {
            url,
            timeStamp: this.storeService.previousPageViewTimeStamp,
          }
        );
      });
  }

  async logEvent(eventName: string, data: any) {
    this.addThisEventToList({
      eventType: eventName,
      data,
    });

    if (environment.env === 'live' && environment.debug === false) {
      this.facebook.logEvent(eventName, {});
    }
  }

  async addThisEventToList({
    eventType,
    data,
  }: {
    eventType: string;
    data: any;
  }) {
    if (!eventType) {
      return;
    }

    const deviceInfo = this.storeService.deviceInfo.getValue();
    const user = this.storeService.loggedInUser.value;

    const activity: AnalyticData = {
      eventType,
      data,
      deviceInfo: {
        websiteVersion: deviceInfo.websiteVersion,
        platform: deviceInfo.platform,
        uuid: deviceInfo.uuid,
      },
      userId: user && user.uid,
      sessionId: this.storeService.userSessionId,
    };

    this.saveAnalyticsListInDB({ activity });
  }

  private async saveAnalyticsListInDB({
    activity,
  }: {
    activity: AnalyticData;
  }) {
    if (this.appService.isObjectEmpty(activity)) {
      return;
    }

    const updateAnalyticsResponse = await this.requestService.send<ApiResponse>(
      'POST',
      `${endpoints.addActivity}`,
      {
        body: {
          analyticsList: [activity],
        },
      }
    );

    const { code, description } = updateAnalyticsResponse.status;
    if (code !== 200) {
      console.error('update analytics error: ', { code, description });
    }
    return true;
  }
}
