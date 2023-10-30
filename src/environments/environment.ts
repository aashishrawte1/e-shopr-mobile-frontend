// PRODUCTION MODE
// import * as config from './environment-config.json';
// import { IEnvironment } from '../app/models';
// export const environment: IEnvironment = {
//   env: 'live',
//   debug: true,
//   stripePublishableKeys: 'pk_test_A3nYbuakXEv0jMm1GsuujzAR00QFcFptok',
//   serverUrl: `${config.ngrokUrl}`,
//   firebaseConfig: {
//     apiKey: 'AIzaSyB-Vmz_EZ0bqfDUFuOxhrBj-y7mwLvSRyE',
//     authDomain: 'greenday-landing-page.firebaseapp.com',
//     databaseURL: 'https://greenday-landing-page.firebaseio.com',
//     projectId: 'greenday-landing-page',
//     storageBucket: 'greenday-landing-page.appspot.com',
//     messagingSenderId: '653229316177',
//     appId: '1:653229316177:web:cdbc80ecee7107f4658070',
//     measurementId: 'G-R4BQ0YFYCH',
//   },
//   auth: {
//     google: {
//       webClientId:
//         '653229316177-5muqkotcvu95odsqaqbq6lta9s69ntd8.apps.googleusercontent.com',
//     },
//   },
//   smartLookApiKey: '54541bbdb7726ea35ac2b07ed77928748d316187',
//   googleTagManagerConfig: {
//     id: 'GTM-N7WS4QG',
//     // eslint-disable-next-line @typescript-eslint/naming-convention
//     gtm_auth: 'VG_rKTNfkFF7bor7zid95w',
//     // eslint-disable-next-line @typescript-eslint/naming-convention
//     gtm_preview: 'env-3',
//   },
// };

import * as config from './environment-config.json';
import { IEnvironment } from '../app/models';
export const environment: IEnvironment = {
  env: 'local',
  debug: true,
  serverUrl: `${config.ngrokUrl}`,
  stripePublishableKeys: 'pk_test_A3nYbuakXEv0jMm1GsuujzAR00QFcFptok',
  firebaseConfig: {
    apiKey: 'AIzaSyBIKg7bDQrk1xHqYEZ_2vY4YQtLo6LnRMY',
    authDomain: 'grn-storage.firebaseapp.com',
    databaseURL: 'https://grn-storage.firebaseio.com',
    projectId: 'grn-storage',
    storageBucket: 'grn-storage.appspot.com',
    messagingSenderId: '358691377575',
    appId: '1:358691377575:web:b10b44e895229111d12682',
    measurementId: 'G-074HX5VNX3',
  },
  auth: {
    google: {
      webClientId:
        '358691377575-0qqbm47c0t63g8min27tha9m3danhmas.apps.googleusercontent.com',
    },
  },
  smartLookApiKey: 'null',
  googleTagManagerConfig: {
    id: 'GTM-N7WS4QG',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    gtm_auth: 'VG_rKTNfkFF7bor7zid95w',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    gtm_preview: 'env-3',
  },
};
