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
import { ModalController, NavController, Platform } from '@ionic/angular';
import { UserInfoInputComponent } from '../../../components/user-info-input/user-info-input.component';
import {
  EMAIL_REGEX,
  PageRoutes,
  PASSWORD_MIN_LENGTH,
} from '../../../constants';
import { CurrentUser } from '../../../models';
import {
  ICountryDetail,
  RegistrationPageData,
} from '../../../models/app-data.model';
import { AppService } from '../../../services/app.service';
import { AuthService } from '../../../services/auth.service';
import { RoutingStateService } from '../../../services/routing-state.service';
import { StoreService } from '../../../services/store.service';
import PageObserverComponent from '../../../utils/component-observer.util';

@Component({
  selector: 'user-portal-register',
  templateUrl: 'register.page.html',
  styleUrls: ['./register.page.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent
  extends PageObserverComponent
  implements OnInit {
  jsonData = {} as any;
  returnUrl: string;
  emailForm: FormGroup;
  passwordMinLength = PASSWORD_MIN_LENGTH;
  loginError = null;
  pageConfig: RegistrationPageData;
  regionalisationSupportedCountries: Array<ICountryDetail>;
  defaultCountrySelection: string;
  constructor(
    private navController: NavController,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private routingStateService: RoutingStateService,
    private appService: AppService,
    private storeService: StoreService,
    public platform: Platform,
    private modalController: ModalController
  ) {
    super();
  }

  async ngOnInit() {
    this.regionalisationSupportedCountries = this.appService.getRegionalisationSupportedCountries();
    this.defaultCountrySelection = this.storeService.json.countryListConfig.value.defaultSelection;
    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.registrationPage;
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
      country: this.defaultCountrySelection,
    });
    this.cdr.detectChanges();
  }
  get email(): any {
    return this.emailForm.controls.email;
  }

  get password(): any {
    return this.emailForm.controls.password;
  }
  get country(): any {
    return this.emailForm.controls.country;
  }

  async loginWithEmail(event: { preventDefault: () => void }) {
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

  async doFbLogin() {
    const response = await this.authService
      .login({ provider: 'facebook' })
      .catch((_) => {});
  }

  async doGoogleLogin() {
    const response = await this.authService
      .login({ provider: 'google' })
      .catch((_) => {});
  }
  async doAppleLogin() {
    const response = await this.authService
      .login({ provider: 'apple' })
      .catch((_) => {});
  }

  skipToHomePage() {
    this.navController.navigateRoot(`${PageRoutes.fullUrls.home}`, {
      replaceUrl: true,
    });
  }

  async goBack() {
    const route = await this.routingStateService.getLastNonLoginRoute();
    this.navController.navigateBack(route.url, {
      replaceUrl: true,
    });
  }

  onLoginClick(event: any) {
    event.preventDefault();
    this.navController.navigateForward(PageRoutes.fullUrls.login, {
      replaceUrl: true,
    });
  }
  onCountrySelected(target: EventTarget) {
    this.defaultCountrySelection = (target as any).value;
  }
  onAgreementLinkClick() {
    this.appService.openInAppBrowser({
      url: this.storeService.json.pageConfig.value.constants
        .termsAndConditionLink,
    });
  }
}
