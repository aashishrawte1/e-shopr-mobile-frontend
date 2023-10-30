import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertController, NavController, Platform } from '@ionic/angular';
import {
  EMAIL_REGEX,
  PageRoutes,
  PASSWORD_MIN_LENGTH,
} from '../../../constants';
import { LoginPageData } from '../../../models/app-data.model';
import { AppService } from '../../../services/app.service';
import { AuthService } from '../../../services/auth.service';
import { RoutingStateService } from '../../../services/routing-state.service';
import { StoreService } from '../../../services/store.service';
import PageObserverComponent from '../../../utils/component-observer.util';

@Component({
  selector: 'user-portal-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent
  extends PageObserverComponent
  implements OnInit {
  jsonData = {} as any;
  returnUrl: string;
  emailForm: FormGroup;
  passwordMinLength = PASSWORD_MIN_LENGTH;

  loginError = null;
  pageConfig: LoginPageData;
  constructor(
    private navController: NavController,
    public platform: Platform,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private appService: AppService,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef,
    private routingStateService: RoutingStateService,
    private storeService: StoreService
  ) {
    super();
  }

  ngOnInit() {
    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.loginPage;
      this.cdr.detectChanges();
    });
    this.emailForm = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(EMAIL_REGEX),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(this.passwordMinLength),
      ]),
    });
    this.cdr.detectChanges();
  }

  get email(): any {
    return this.emailForm.controls.email;
  }

  get password(): any {
    return this.emailForm.controls.password;
  }

  async loginWithEmail(event: any) {
    event.preventDefault();
    if (this.emailForm.invalid) {
      return false;
    }
    const response = (await this.authService.signInWithEmailAndPassword(
      this.emailForm.value
    )) as any;

    if (response && response.hasError) {
      this.loginError = response.errorMessage;
      this.cdr.detectChanges();
      return;
    }
  }

  onCreateAccountClick(event: any) {
    event.preventDefault();
    this.navController.navigateForward(PageRoutes.fullUrls.register, {
      replaceUrl: true,
    });
  }

  async doFbLogin() {
    await this.authService.login({ provider: 'facebook' });
  }

  async doGoogleLogin() {
    await this.authService.login({ provider: 'google' });
  }

  async doAppleLogin() {
    await this.authService.login({ provider: 'apple' }).catch((error) => {});
  }

  async presentLoading(loading: any) {
    return await loading.present();
  }

  async onForgotPasswordClick() {
    let email = '';
    const alert = await this.alertController.create({
      backdropDismiss: true,
      keyboardClose: false,
      inputs: [
        {
          type: 'email',
          placeholder: 'Enter your email',
          name: 'email',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Submit',
          handler: (data) => {
            email = data.email;
          },
        },
      ],
    });
    await alert.present();
    const didDismiss = await alert.onWillDismiss();

    if (!didDismiss) {
      return;
    }

    if (!email) {
      return;
    }
    const response = await this.authService.sendResetPasswordEmail(email);
    if (!response) {
      return;
    }

    this.appService.showAlert({
      message:
        'If you entered a valid email, a password reset email will be sent to you shortly. You can reset password from there. ',
    });
  }

  async goBack() {
    const route = await this.routingStateService.getLastNonLoginRoute();
    this.navController.navigateBack(route.url, {
      replaceUrl: true,
    });
  }
  onAgreementLinkClick() {
    this.appService.openInAppBrowser({
      url: this.storeService.json.pageConfig.value.constants
        .termsAndConditionLink,
    });
  }
}
