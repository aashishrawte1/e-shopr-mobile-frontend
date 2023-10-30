import { ApiResponse } from '.';

export interface IGetAppStoreResponse extends ApiResponse {
  result: IAppStoreResult[];
}
export interface IAppStoreResult {
  uniqueId: string;
  updated_at: string;
  ios: IOS;
  android: Android;
}
export interface IOS {
  version: string;
  storeLink: string;
}
export interface Android {
  version: string;
  storeLink: string;
}
