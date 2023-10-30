import { ActiveFilterItem } from './product.model';
import { ExternalNavigationType } from './external-nav-type.model';

export interface INotificationReceivedTapEntity {
  to: string | number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  collapse_key: string;
  notification: {
    body: string | number;
    title: string | number;
  };
  data: INotificationDataEntity;
}

export interface INotificationDataEntity {
  uniqueMessageId: any;
  link: string;
  action: ExternalNavigationType;
  data?: {
    activeFilter?: ActiveFilterItem;
    searchTerm?: string;
  };
}

export interface IReferrerNotificationResponse {
  uniqueId: string;
  token: string;
}
