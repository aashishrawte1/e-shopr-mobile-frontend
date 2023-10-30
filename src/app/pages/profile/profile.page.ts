import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Plugins } from '@capacitor/core';
import { NavController } from '@ionic/angular';
import { CustomGoogleTagManagerService } from '../../services/custom-google-tag-manager.service';
import { filter } from 'rxjs/operators';
import { NUMBER_REGEX, PageRoutes, PHONE_NUMBER_REGEX } from '../../constants';
import { IAvailableCountries } from '../../models';
import { ICountryDetail, ProfilePageData } from '../../models/app-data.model';
import { gtmEventNames } from '../../models/gtm-event.model';
import { ReferralCodeClaimStatus } from '../../models/user-coin-activity.model';
import { AppShareService } from '../../services/app-share.service';
import { AppService } from '../../services/app.service';
import { CoinService } from '../../services/coin.service';
import { ReferralCodeService } from '../../services/referral-code.service';
import { StaticAssetService } from '../../services/static-asset.service';
import { StoreService } from '../../services/store.service';
import { UserProfileService } from '../../services/user-profile.service';
import PageObserverComponent from '../../utils/component-observer.util';
import { EMAIL_REGEX } from '../../constants';
import { async } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/naming-convention
const { Share } = Plugins;

@Component({
  selector: 'user-portal-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent
  extends PageObserverComponent
  implements OnInit {
  disableButton = true;
  editEnabled = false;
  editModeOn = false;
  referralCodeClaimed: ReferralCodeClaimStatus;
  userReferralCode: string;
  pageConfig: ProfilePageData;
  regionalisationSupportedCountries: Array<ICountryDetail>;
  selectedCountry = {} as ICountryDetail;
  selectedCountryName: string;
  emailFormatIsValid = true;
  codeFormateIsValid = true;
  phoneFormateIsValid = true;
  emailRegex = new RegExp(EMAIL_REGEX);
  emailChangeError: boolean;
  loginRequiredError: boolean;
  emailInUsedError: boolean;
  emailUpdateSuccessful: boolean;
  phoneUpdateSuccessful: boolean;
  constructor(
    public storeService: StoreService,
    private cdr: ChangeDetectorRef,
    public assetService: StaticAssetService,
    public appService: AppService,
    private coinService: CoinService,
    private userProfileService: UserProfileService,
    private referralCodeService: ReferralCodeService,
    private _location: Location,
    private navController: NavController,
    private appShareService: AppShareService,
    private gtmService: CustomGoogleTagManagerService
  ) {
    super();
  }
  doRefresh(event: any) {
    event.target.complete();
  }
  async ngOnInit() {
    this.regionalisationSupportedCountries = this.appService.getRegionalisationSupportedCountries();
    this.observe(
      this.storeService.loggedInUser.pipe(filter((user) => !!user)),
      async (_) => {
        this.selectedCountry = this.getCurrentCountryForUser();
        this.selectedCountryName = this.selectedCountry.countryName;
        this.cdr.detectChanges();
      }
    );

    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.profilePage;
      this.cdr.detectChanges();
    });
    this.observe(this.referralCodeService.referralCode, (val) => {
      this.userReferralCode = val;
      this.cdr.detectChanges();
    });

    this.observe(
      this.coinService.checkIfReferralCodeClaimedInFirebase({
        uid: this.storeService.loggedInUser.value?.uid,
      }),
      (val) => {
        this.referralCodeClaimed = val;
        this.cdr.detectChanges();
      }
    );
  }
  getCurrentCountryForUser(): ICountryDetail {
    const userCountry = this.userProfileService.getUsersCountry();
    return this.appService.getCountryDetail({
      valueToCompare: userCountry,
      propName: 'countryName',
    });
  }

  async updateFullName(fullName: string | number) {
    await this.userProfileService.updateFullName({
      fullName: fullName as string,
    });
  }
  checkEmailFormat(email: string | number) {
    if (this.emailRegex.test(email as string)) {
      this.emailFormatIsValid = true;
    } else {
      this.emailFormatIsValid = false;
    }
  }

  checkCodeFormat(code: string | number) {
    if (!NUMBER_REGEX.test((code || 0).toString())) {
      this.codeFormateIsValid = true;
    } else {
      this.codeFormateIsValid = false;
    }
  }

  checkPhoneFormat(phone: string | number) {
    if (!PHONE_NUMBER_REGEX.test((phone || 0).toString())) {
      this.phoneFormateIsValid = true;
    } else {
      this.phoneFormateIsValid = false;
    }
  }

  async updateEmail(email: string | number) {
    const res = await this.userProfileService.updateEmail({
      email: email as string,
    });
    if (res) {
      if (res.code === 'auth/requires-recent-login') {
        this.emailChangeError = true;
        this.loginRequiredError = true;
        this.emailInUsedError = false;
        this.emailUpdateSuccessful = false;
      } else if (res.code === 'auth/email-already-in-use') {
        this.emailChangeError = true;
        this.loginRequiredError = false;
        this.emailInUsedError = true;
        this.emailUpdateSuccessful = false;
      }
    } else {
      this.emailUpdateSuccessful = true;
      this.emailChangeError = false;
      this.loginRequiredError = false;
      this.emailInUsedError = false;
    }

    this.cdr.detectChanges();
    return;
  }

  async updatePhone(phoneComponents: { code: number; number: number }) {
    await this.userProfileService.updatePhone(phoneComponents);
  }

  async save(
    fullName: string | number,
    email: string | number,
    code: string | number,
    phone: string | Number
  ) {
    this.editEnabled = false;
    this.editModeOn = false;
    if (
      fullName !== '' &&
      fullName !== this.storeService.loggedInUser.value?.fullName
    ) {
      this.updateFullName(fullName);
    }

    if (!!email && email !== this.storeService.loggedInUser.value?.email) {
      this.updateEmail(email);
    }

    if (!!phone && !!code) {
      const phoneComponents = {
        code: +code,
        number: +phone,
      };
      this.updatePhone(phoneComponents);
    }
  }

  async addProfilePicture() {
    this.userProfileService.addProfilePicture().then((_) => {
      try {
        this.gtmService.recordEvent({
          event: gtmEventNames.profilePictureChanged,
        });
      } catch (error) {}
    });
  }

  onEditClick() {
    this.editEnabled = !this.editEnabled;
    this.editModeOn = !this.editModeOn;
  }

  goToMarketPage() {
    this.navController.navigateForward(PageRoutes.fullUrls.market);
  }
  goToHelpPage() {
    this.navController.navigateForward(PageRoutes.fullUrls.help);
  }

  claimDailyReward() {
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.profilePageClaimDailyGemClick,
        date: this.appService.getFormattedDate(),
      });
    } catch (error) {}
    this.coinService.giveDailyReward();
  }

  async shareReferralCode() {
    const appDownloadLink = await this.appShareService.getAppShareLink();
    let appShareReferralData = this.storeService.json.pageConfig.value
      .appShareReferralData;
    const coinCount = this.storeService.coinsActionList
      .getValue()
      ?.find((d) => d.actionType === 'referee_claimed')?.coins;

    appShareReferralData = JSON.parse(
      JSON.stringify(appShareReferralData)
        .replace(/{{appDownloadLink}}/g, appDownloadLink)
        .replace(/{{referralCode}}/g, this.userReferralCode)
        .replace(/{{gemCount}}/g, coinCount + '')
    );
    Share.share(appShareReferralData);

    try {
      this.gtmService.recordEvent({
        event:
          gtmEventNames.profilePageShareGreenDayWithFriendsFor10000GemsClick,
      });
    } catch (error) {}
  }

  async showInputPopupForReferralCode() {
    this.appService.showAlert({
      header: 'Referral Code',
      backdropDismiss: true,
      keyboardClose: true,
      inputs: [
        {
          type: 'text',
          placeholder: 'Enter Code',
          name: 'referralCode',
        },
      ],
      buttons: [
        {
          text: 'Claim Reward',
          handler: (data) =>
            this.useReferralCode({ referralCode: data?.referralCode }),
        },

        {
          text: 'Cancel',
          role: 'destroy',
        },
      ],
    });
  }

  async useReferralCode({ referralCode }: { referralCode: string }) {
    if (this.userReferralCode === referralCode) {
      this.appService.showAlert({
        message: 'You can not use your own referral code.',
      });
      return;
    }
    if (!referralCode) {
      return;
    }

    const {
      status,
    } = await this.referralCodeService.checkIfReferralCodeIsValid({
      referralCode,
    });

    if (status.code !== 200) {
      this.appService.showAlert({
        message: status.description,
      });
      return;
    }

    await this.coinService.saveActivity({
      actionType: 'referee_claimed',
      data: {
        referralCode,
      },
    });
    this.cdr.detectChanges();
  }
  goBack() {
    this._location.back();
  }
  async onCountrySelected(countryName: IAvailableCountries) {
    if (this.storeService.loggedInUser.value?.country === countryName) {
      return;
    }
    this.selectedCountry = this.appService.getCountryDetail({
      valueToCompare: countryName,
      propName: 'countryName',
    });
    this.cdr.detectChanges();

    await this.appService.showAlert({
      header: 'Changing country?',
      backdropDismiss: false,
      buttons: [
        {
          role: 'cancel',
          text: 'Cancel',
          handler: () => {
            const userCountry = this.storeService.loggedInUser.value.country;
            this.selectedCountry = this.appService.getCountryDetail({
              valueToCompare: userCountry,
              propName: 'countryName',
            });
            this.selectedCountryName = userCountry;
            this.cdr.detectChanges();
            return;
          },
        },
        {
          text: 'Okay',
          handler: async () => {
            this.changeCountry({ newCountry: countryName });
          },
        },
      ],
    });
  }

  async changeCountry({ newCountry }: { newCountry: IAvailableCountries }) {
    const currentCountry = this.storeService.loggedInUser.value.country;

    if (newCountry === currentCountry) {
      return;
    }

    this.selectedCountry = this.appService.getCountryDetail({
      valueToCompare: newCountry,
      propName: 'countryName',
    });
    this.cdr.detectChanges();
    await this.userProfileService.updateCountry({
      country: newCountry,
    });
    this.storeService.reloadWebsiteStream.next(true);

    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.profilePageCountryChanged,
        from: currentCountry,
        to: newCountry,
      });
    } catch (error) {}
  }
  onAgreementLinkClick() {
    this.appService.openInAppBrowser({
      url: this.storeService.json.pageConfig.value.constants
        .termsAndConditionLink,
    });
  }
}
