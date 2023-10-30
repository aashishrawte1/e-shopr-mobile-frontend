import { ApiResponse } from '.';
import { ILoggedInUser } from './user';

export type IAvailableCountries = 'singapore' | 'malaysia';
export interface IGetProfileResponse extends ApiResponse {
  result: ILoggedInUser;
}
