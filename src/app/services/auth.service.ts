import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import {
  ASAuthorizationAppleIDRequest,
  SignInWithApple,
} from '@ionic-native/sign-in-with-apple/ngx';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  Platform,
} from '@ionic/angular';
import firebase from 'firebase';
import { filter, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserInfoInputComponent } from '../components/user-info-input/user-info-input.component';
import { PageRoutes } from '../constants';
import { ApiResponse, ILoggedInUser, TLoginProvider } from '../models';
import { ApiService } from './api.service';
import { AppService } from './app.service';
import { ChatService } from './chat.service';
import { SentryLoggerService } from './sentry-logger.service';
import { StoreService } from './store.service';
import { UserProfileService } from './user-profile.service';
export interface IGetLoginProviderResponse extends ApiResponse {
  result: {
    provider: string;
  };
}

interface IAlertInputData {
  email: string | null;
  phoneWithCountryCode: {
    code: number;
    number: number;
  };
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private appService: AppService,
    public platform: Platform,
    public loadingController: LoadingController,
    private alertController: AlertController,
    private facebook: Facebook,
    private googlePlus: GooglePlus,
    private signInWithApple: SignInWithApple,
    private apiService: ApiService,
    private chatService: ChatService,
    private sentryLoggerService: SentryLoggerService,
    private storeService: StoreService,
    private navController: NavController,
    private userProfileService: UserProfileService,
    private modalController: ModalController
  ) {}

  async init() {}

  async signInWithEmailAndPassword({
    email,
    password,
    country,
  }: {
    email: string;
    password: string;
    country?: string;
  }): Promise<
    | {
        hasError: boolean;
        errorMessage: string;
      }
    | ILoggedInUser
  > {
    const loginStatus = {} as {
      hasError: boolean;
      errorMessage: string;
    };
    await this.createLoader();

    const response = await this.afAuth
      .signInWithEmailAndPassword(email, password)
      .catch(async (error) => {
        const { code, message } = error;
        console.error('login with email error', error);
        if (code === 'auth/user-not-found') {
          const createAccountConfirmationResponse = await new Promise<boolean>(
            async (resolve, reject) => {
              await this.storeService.authLoader.dismiss();
              const alert = await this.alertController.create({
                header: 'Create account?',
                message: `We could not find an account associated with the credentials provided. We can create one for you now. Is this <strong>${email}</strong> correct? `,
                buttons: [
                  {
                    role: 'cancel',
                    text: 'Cancel',
                    handler: () => {
                      reject('user cancelled account creation');
                    },
                  },
                  {
                    text: 'Create',
                    handler: () => {
                      resolve(true);
                    },
                  },
                ],
              });
              alert.present();
            }
          );

          if (!createAccountConfirmationResponse) {
            loginStatus.errorMessage = 'Account creation cancelled.';
            loginStatus.hasError = true;
          }

          await this.createLoader();
          return await this.afAuth
            .createUserWithEmailAndPassword(email, password)
            .catch((createUserError) => {
              const { message: errorMessage } = createUserError;
              loginStatus.hasError = true;
              loginStatus.errorMessage = errorMessage;
            });
        }

        loginStatus.errorMessage = message;
        loginStatus.hasError = true;
      });

    if (loginStatus.hasError) {
      await this.storeService.authLoader.dismiss();

      this.sentryLoggerService.logError({
        error: new Error(loginStatus.errorMessage),
      });
      return loginStatus;
    }

    if (response && response.user) {
      await this.storeService.authFirebaseUser.next(
        (response as firebase.auth.UserCredential).user
      );
      const createUserIfNotPresentResponse = await this.createUserIfNotPresent({
        firebaseUser: response,
        provider: 'email',
        country,
      });

      this.goToRouteAfterSuccessfulLogin(createUserIfNotPresentResponse);
    }
  }

  async getPreviousLoginProvider({
    email,
    selectedLoginProvider,
  }: {
    email: string;
    selectedLoginProvider: string;
  }) {
    const loginProviderResponse = (
      await this.apiService.fetchLoginProvider({
        email,
        provider: 'email',
      })
    ).result;

    const previousLoginProvider = loginProviderResponse?.provider;

    let message = '';
    const providerMismatch = previousLoginProvider !== selectedLoginProvider;
    if (providerMismatch) {
      if (previousLoginProvider) {
        message = `You logged in using <strong>${previousLoginProvider.toUpperCase()} previously.</strong> Please try using <strong>${previousLoginProvider}</strong>`;
      } else {
        message = 'No login provider was found. ';
      }
    }
    return {
      message,
      previousLoginProvider,
    };
  }

  async showMessage(message: string) {
    return await this.appService.showAlert({
      message,
    });
  }

  async signInWithCredential(credential: any) {
    return await this.afAuth.signInWithCredential(credential);
  }

  async logout() {
    await this.afAuth.signOut();
    await this.storeService.authFirebaseUser.next(null);
  }

  async loginWithFb() {
    let permissions = new Array<string>();
    permissions = ['public_profile', 'email'];
    const response = await this.facebook.login(permissions);
    return {
      response,
      credential: response && response?.authResponse?.accessToken,
    };
  }

  async loginWithApple() {
    const response = await this.signInWithApple.signin({
      requestedScopes: [
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,
        ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail,
      ],
    });

    const credential = response.identityToken;

    return {
      response,
      credential,
    };
  }

  async createLoader() {
    if (this.storeService.authLoader) {
      await this.storeService.authLoader.dismiss();
    }

    this.storeService.authLoader = await this.appService.showLoader({
      backdropDismiss: false,
      showBackdrop: true,
      duration: 2 * 60 * 1000,
      cssClass: 'custom-loader__without-background',
      message: null,
      spinner: 'bubbles',
    });
  }

  async loginWithGoogle() {
    const response = await this.googlePlus.login({
      scopes: 'profile email', // defaults to `profile` and `email`.
      webClientId: environment.auth.google.webClientId,
      offline: true,
    });
    return {
      response,
      credential: response.idToken,
    };
  }

  async login({ provider }: { provider: TLoginProvider }) {
    await this.createLoader();

    const loginResponse = await new Promise<void | {
      user: ILoggedInUser;
      isNew: boolean;
    }>(async (resolve, reject) => {
      let providerSignInRes: any;
      let authProvider: any;
      if (provider === 'google') {
        providerSignInRes = await this.loginWithGoogle().catch((error) => {
          this.sendErrorLogToSentry(error);
          reject('Login with google unsuccessful...');
          return;
        });
        authProvider = 'GoogleAuthProvider';
      } else if (provider === 'facebook') {
        providerSignInRes = await this.loginWithFb().catch((error) => {
          this.sendErrorLogToSentry(error);
          reject('Login with facebook unsuccessful...');
          return;
        });
        authProvider = 'FacebookAuthProvider';
      } else if (provider === 'apple') {
        providerSignInRes = await this.loginWithApple().catch((error) => {
          this.sendErrorLogToSentry(error);
          reject('Login with apple unsuccessful...');
          return;
        });
      }

      let credential;
      if (provider === 'apple') {
        credential = new firebase.auth.OAuthProvider('apple.com').credential(
          providerSignInRes && providerSignInRes.credential
        );
      } else {
        credential = firebase.auth[authProvider].credential(
          providerSignInRes && providerSignInRes.credential
        );
      }

      const signWithCredResponse = await this.signInWithCredential(
        credential
      ).catch(async (error) => {
        this.sendErrorLogToSentry(error);
        const { code, message } = error;

        if (code === 'auth/account-exists-with-different-credential') {
          const { email } = error;

          const dbUser = await this.getPreviousLoginProvider({
            email,
            selectedLoginProvider: provider,
          });

          if (dbUser.previousLoginProvider !== provider) {
            reject(dbUser.message);
            return;
          }
        }

        reject(message);
        return;
      });

      if (!signWithCredResponse) {
        reject('An error occurred while logging you in.');
        return;
      }

      await this.storeService.authFirebaseUser.next(
        (signWithCredResponse as firebase.auth.UserCredential).user
      );

      const createUserResponse = await this.createUserIfNotPresent({
        firebaseUser: signWithCredResponse || null,
        extras: {
          fullName:
            provider === 'apple'
              ? (providerSignInRes?.response?.fullName?.givenName || '') +
                ' ' +
                (providerSignInRes?.response?.fullName?.familyName || '')
              : signWithCredResponse && signWithCredResponse?.user?.displayName,
        },
        provider,
      });
      resolve(createUserResponse);
    }).catch(async (error) => {
      this.storeService.authLoader.dismiss();
      await this.appService.showAlert({
        message: error,
        buttons: [{ text: 'Okay' }],
      });
    });
    if (!loginResponse) {
      return false;
    }
    this.goToRouteAfterSuccessfulLogin(loginResponse);
  }

  sendErrorLogToSentry(error: any) {
    console.error('Login Error Sign in with credential', JSON.stringify(error));
    this.sentryLoggerService.logError({
      error,
    });
  }

  async createUserIfNotPresent({
    firebaseUser,
    extras,
    provider,
    country,
  }: {
    firebaseUser: firebase.auth.UserCredential;
    provider: string;
    country?: string;
    extras?: { fullName: string };
  }): Promise<{ isNew: boolean; user: ILoggedInUser }> {
    const latestProfile = (
      await this.apiService.fetchMyProfile({
        uid: firebaseUser?.user?.uid,
      })
    ).result;

    await this.storeService.authLoader.dismiss();
    // its existing user and we have set current user now
    if (!!latestProfile) {
      return { isNew: false, user: latestProfile };
    }

    // NEW USER
    const currentUser = {
      uid: firebaseUser?.user?.uid,
      email: firebaseUser?.user?.email,
      country: country ? country : 'singapore',
      fullName: extras?.fullName || '',
      avatarUrl: firebaseUser.user.photoURL,
      provider,
    } as ILoggedInUser;

    // send welcome message in green concierge
    this.chatService.initiateChatForAction({
      type: 'registration_welcome_message',
    });

    await this.createLoader();
    await this.storeService.authFirebaseUser.next(firebaseUser.user);
    await this.storeService.authLoader.dismiss();
    return { isNew: true, user: currentUser };
  }

  async sendResetPasswordEmail(email?: string) {
    const response = await this.afAuth
      .sendPasswordResetEmail(email)
      .catch((_) => {
        return false;
      })
      .then((_) => {
        return true;
      });

    return response;
  }

  async goToRouteAfterSuccessfulLogin({
    isNew,
    user,
  }: {
    isNew: boolean;
    user: ILoggedInUser;
  }) {
    this.userProfileService.updateLastLogin();

    const askForEmail = !user.email;
    const askForPhone = !user.phone;
    const askForFullName = !user.fullName;

    let { email, phone } = user as ILoggedInUser;

    let countryCode = phone?.code;
    let number = phone?.number;
    let fullName = user.fullName;
    // get user email and phone
    if (!(user.email && user.phone && user.fullName)) {
      const modalController = ((await this.modalController.create({
        component: UserInfoInputComponent,
        cssClass: 'user-info-input',
        componentProps: {
          askForEmail,
          askForPhone,
          askForFullName,
        },
      })) as unknown) as HTMLIonModalElement;
      await modalController.present();
      const { data } = (await modalController.onDidDismiss()) as {
        data: {
          email?: string;
          phoneWithCountryCode?: { code: number; number: number };
          fullName?: string;
        };
      };

      email = askForEmail ? data.email : email;
      number = askForPhone ? data.phoneWithCountryCode.number : number;
      countryCode = askForPhone ? data.phoneWithCountryCode.code : countryCode;
      fullName = askForFullName ? data.fullName : user.fullName;
    }

    // when it is new user
    if (isNew === true) {
      // Since this is new user - show them welcome quiz
      await this.apiService.addNewUser({
        user: {
          id: user.uid,
          fullName: fullName,
          email: user.email,
          avatarUrl: user.avatarUrl,
          provider: user.provider,
          country: user.country,
          phoneWithCountryCode: {
            code: countryCode,
            number,
          },
        },
      });

      this.storeService.welcomeQuizCompletedEventStream
        .pipe(
          filter((val) => val === true),
          take(1)
        )
        .subscribe(() => {
          this.navigateToHomeAndReload();
        });
      this.navController.navigateRoot(
        PageRoutes.fullUrls.registrationWelcomeQuizScreenHome,
        { replaceUrl: true }
      );
      return;
    } else {
      if (askForEmail) {
        this.apiService.updateEmail({ email: email });
      }
      if (askForFullName) {
        this.apiService.updateFullName({ fullName });
      }
      if (askForPhone) {
        this.apiService.updatePhone({ code: countryCode, number });
      }
    }

    this.navigateToHomeAndReload();
  }

  navigateToHomeAndReload() {
    this.navController
      .navigateRoot(PageRoutes.fullUrls.home, {
        replaceUrl: true,
      })
      .then(() => {
        this.storeService.reloadWebsiteStream.next(true);
      });
  }
}
