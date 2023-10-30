import { ApiResponse } from '.';
import { AppConfig } from './app-data.model';

export interface AppConfigApiResponse extends ApiResponse {
  result: AppConfig;
}
