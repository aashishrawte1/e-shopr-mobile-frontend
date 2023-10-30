import { FilteredDeviceInfo } from './filtered-device-info.model';

export interface IDeviceRequest {
  user?: string;
  token?: string;
  deviceInfo: FilteredDeviceInfo;
}
