export interface IEnvironment {
  serverUrl: string;
  stripePublishableKeys: string;
  firebaseConfig: FirebaseConfig;
  auth: {
    google: {
      webClientId: string;
    };
  };
  env: 'uat' | 'live' | 'local';
  debug: boolean;
  smartLookApiKey: string;
  googleTagManagerConfig: IGoogleTagManagerConfig;
}

export interface IGoogleTagManagerConfig {
  id: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  gtm_auth: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  gtm_preview: string;
}
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  appId: string;
  measurementId: string;
  messagingSenderId: string;
}
