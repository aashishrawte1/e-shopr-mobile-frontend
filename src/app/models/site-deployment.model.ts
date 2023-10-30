import { ApiResponse } from '.';
export interface ILatestSiteDeployment extends ApiResponse {
  result: {
    releaseTime: string;
  };
}
