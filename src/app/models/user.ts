import { TLoginProvider } from '.';
import { IAvailableCountries } from './IGetProfileResponse';

export interface ILoggedInUser {
  phone?: { code: number; number: number };
  uid: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  country: IAvailableCountries;
  provider: TLoginProvider;
}
