export class AnalyticData {
  eventType: string;
  data: any;
  userId: string;
  deviceInfo: {
    websiteVersion: string;
    platform: string;
    uuid: string;
  };
  timeStamp?: AnalyticTimeStamp | string;
  sessionId: string;
}

export class AnalyticTimeStamp {
  startAt?: string;
  endAt?: string;
  duration?: number;
}
