import { Injectable } from '@angular/core';
import { NavigationEnd, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PageRoutes } from '../constants';
import { UrlData } from '../models';
import { StoreService } from './store.service';
import { CustomGoogleTagManagerService } from './custom-google-tag-manager.service';
import { gtmEventNames } from './../models/gtm-event.model';
import { Location } from '@angular/common';
@Injectable({ providedIn: 'root' })
export class RoutingStateService {
  constructor(
    private router: Router,
    private storeService: StoreService,
    private location: Location,
    private gtmService: CustomGoogleTagManagerService
  ) {}

  public init(): void {
    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd &&
            !(event?.url === '' || event?.url === '/')
        )
      )
      .subscribe(async ({ url }: NavigationEnd) => {
        this.storeService.routingStatePageNavigationUrlStackStream.next([
          ...(this.storeService.routingStatePageNavigationUrlStackStream.getValue() ||
            []),
          {
            url,
            params: await this.getParams({
              locationSearchProp: location.search,
            }),
          },
        ]);

        this.storeService.routingStatePreviousUrlStream.next(
          await this.getPreviousUrl()
        );
        this.storeService.routingStateCurrentUrlStream.next(
          await this.getCurrentUrl()
        );
        try {
          this.gtmService.recordEvent({
            event: gtmEventNames.pageViewEvent,
            pageName: url,
            state: this.location.getState(),
          });
        } catch (error) {}
      });
  }

  async getPreviousUrl(position?: number): Promise<UrlData> {
    const history = this.storeService.routingStatePageNavigationUrlStackStream.getValue();
    if (!history || history.length === 0) {
      return this.storeService.routingStateDefaultRoute;
    }

    return history[history.length - (position ? position : 2)];
  }

  async getCurrentUrl(): Promise<UrlData> {
    const history =
      this.storeService.routingStatePageNavigationUrlStackStream.getValue() ||
      [];
    return (
      history[history.length - 1] || this.storeService.routingStateDefaultRoute
    );
  }

  async getParams({ locationSearchProp }: { locationSearchProp: string }) {
    const params = {} as Params;
    const query = locationSearchProp.substring(1);
    const queryArray = query.split('&');
    for (const q of queryArray) {
      const pair = q.split('=');
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  }

  get currentRoute(): Observable<UrlData> {
    return this.storeService.routingStateCurrentUrlStream.pipe(
      filter((route) => !!(route && route.url))
    );
  }

  get previousRoute(): Observable<UrlData> {
    return this.storeService.routingStatePreviousUrlStream;
  }

  isAuthRoute(url: string) {
    return (
      url.includes(PageRoutes.fullUrls.login) ||
      url.includes(PageRoutes.fullUrls.register)
    );
  }

  async getLastNonLoginRoute() {
    let startCount = 1;
    let previousUrl = await this.getPreviousUrl(startCount++);
    while (previousUrl && this.isAuthRoute(previousUrl.url)) {
      previousUrl = await this.getPreviousUrl(startCount++);
    }
    if (!previousUrl) {
      previousUrl = { params: [], url: PageRoutes.fullUrls.home };
    }
    return previousUrl;
  }
}
