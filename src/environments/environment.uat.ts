import { IEnvironment } from '../app/models';
export const environment: IEnvironment = {
  env: 'uat',
  debug: true,
  // serverUrl: `https://userportal-uat-backend-server.greendayapp.com`,
  serverUrl: `http://localhost:3001`,
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
  // smartLookApiKey: null,
  smartLookApiKey: '',
  googleTagManagerConfig: {
    id: 'GTM-N7WS4QG',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    gtm_auth: 'VG_rKTNfkFF7bor7zid95w',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    gtm_preview: 'env-3',
  },
};
