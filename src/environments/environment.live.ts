import { IEnvironment } from '../app/models';
export const environment: IEnvironment = {
  env: 'live',
  debug: false,
  stripePublishableKeys: 'pk_live_xRPhtOyMSqaMfPo3yIaOg8tR00w2aTi0yJ',
  serverUrl: 'https://userportal-prod-backend-server.greendayapp.com',
  firebaseConfig: {
    apiKey: 'AIzaSyB-Vmz_EZ0bqfDUFuOxhrBj-y7mwLvSRyE',
    authDomain: 'greenday-landing-page.firebaseapp.com',
    databaseURL: 'https://greenday-landing-page.firebaseio.com',
    projectId: 'greenday-landing-page',
    storageBucket: 'greenday-landing-page.appspot.com',
    messagingSenderId: '653229316177',
    appId: '1:653229316177:web:cdbc80ecee7107f4658070',
    measurementId: 'G-R4BQ0YFYCH',
  },
  auth: {
    google: {
      webClientId:
        '653229316177-5muqkotcvu95odsqaqbq6lta9s69ntd8.apps.googleusercontent.com',
    },
  },
  smartLookApiKey: '54541bbdb7726ea35ac2b07ed77928748d316187',
  googleTagManagerConfig: {
    id: 'GTM-N7WS4QG',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    gtm_auth: 'tp191urzj15u80tOln5_qw',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    gtm_preview: 'env-1',
  },
};
