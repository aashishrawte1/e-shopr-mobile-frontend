import { DownTimeConfiguration } from '../models/downtimeConfig.interface';

export const DowntimeConfigMock: DownTimeConfiguration = {
  activateDowntime: true,
  downTimeMessage:
    'We are updating your some services to make app better. We are very sorry for the inconvenience caused. Check back in a while. ',
  estimatedUpTime: '2020-01-30T18:30:43',
};
