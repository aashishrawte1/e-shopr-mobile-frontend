export interface IAddNewUserRequest {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  provider: string;
  country?: string;
  phoneWithCountryCode?: {
    number: number;
    code: number;
  };
}
