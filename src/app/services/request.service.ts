import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpLogger } from '../utils/logger';

export type RequestMethod = 'GET' | 'POST' | 'PATCH';
export enum StatusCodes {
  SUCCESS = 200,
}
@Injectable({ providedIn: 'root' })
export class RequestService {
  constructor(private http: HttpClient, private navController: NavController) {}
  init() {}
  async send<T>(
    method: RequestMethod,
    url: string,
    options?: { apiTimeout?: number; body?: any; headers?: any }
  ) {
    const { apiTimeout = 180000, body, headers } = options || {};

    const startTime = Date.now();
    if (!url.startsWith('http')) {
      url = `${environment.serverUrl}/${url}`;
    }

    let log: any = { method, url, apiTimeout, body, headers };
    if (environment.debug === true) {
      HttpLogger.logInfo('REQUEST', 'SEND', log);
    }
    let response: T;

    if (method === 'GET') {
      response = await this.http
        .get<T>(url, { headers })
        .pipe(timeout(apiTimeout))
        .toPromise();
    }

    if (method === 'POST') {
      response = await this.http
        .post<T>(url, body, { headers })
        .pipe(timeout(apiTimeout))
        .toPromise();
    }
    if (method === 'PATCH') {
      response = await this.http
        .patch<T>(url, body, { headers })
        .pipe(timeout(apiTimeout))
        .toPromise();
    }
    const statusCode =
      (response && (response as any).status && (response as any).statusCode) ||
      '';
    if (statusCode === StatusCodes.SUCCESS) {
      // this.cache.put({ req: log, data: response });
    }
    const endTime = Date.now();
    log = { ...log, result: response, timeUsed: `${endTime - startTime}ms` };
    if (environment.env === 'live' && environment.debug === false) {
      delete log.result;
      HttpLogger.logSuccess('REQUEST', 'COMPLETE', {
        ...log,
        result: 'removed response for production',
      });
    } else {
      HttpLogger.logSuccess('REQUEST', 'COMPLETE', {
        ...log,
      });
    }

    return response;
  }
}
