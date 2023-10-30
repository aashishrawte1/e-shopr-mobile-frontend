import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavController } from '@ionic/angular';
import { CustomGoogleTagManagerService } from '../../services/custom-google-tag-manager.service';
import { EMAIL_REGEX } from '../../constants';
import { ContactUsPageData } from '../../models/app-data.model';
import { gtmEventNames } from '../../models/gtm-event.model';
import { AppService } from '../../services/app.service';
import { StoreService } from '../../services/store.service';
import PageObserverComponent from '../../utils/component-observer.util';

@Component({
  selector: 'user-portal-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactUsPageComponent
  extends PageObserverComponent
  implements OnInit {
  contactForm: FormGroup;
  countryCodeMinLength = 0;
  numberMinLength = 0;
  contactMessageMinLength = 0;
  contactMessageMaxLength = 0;
  pageConfig: ContactUsPageData;
  constructor(
    private formBuilder: FormBuilder,
    private app: AppService,
    private _location: Location,
    private storeService: StoreService,
    private cdr: ChangeDetectorRef,
    private navController: NavController,
    private gtmService: CustomGoogleTagManagerService
  ) {
    super();
  }
  doRefresh(event: any) {
    event.target.complete();
  }
  async ngOnInit() {
    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.contactUsPage;

      const {
        countryCodeMinLength,
        numberMinLength,
        contactMessageMinLength,
        contactMessageMaxLength,
      } = config?.componentData?.contactUsPage?.defaultValue;

      this.countryCodeMinLength = +countryCodeMinLength;
      this.numberMinLength = +numberMinLength;
      this.contactMessageMinLength = +contactMessageMinLength;
      this.contactMessageMaxLength = +contactMessageMaxLength;

      this.loadForm();
      this.cdr.detectChanges();
    });
  }

  get email() {
    return this.contactForm.controls.email;
  }
  get number() {
    return this.contactForm.controls.number;
  }
  get message() {
    return this.contactForm.controls.message;
  }
  get code() {
    return this.contactForm.controls.code;
  }
  async sendMessage() {
    if (this.contactForm.invalid) {
      return false;
    }

    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.contactUsPageSendMessageButtonClick,
      });
    } catch (error) {}
    const loader = await this.app.showLoader();
    let message = 'Your message was sent successfully.';
    await this.app
      .sendMessage({
        messageOrigin: 'contact-us',
        messageData: this.contactForm.value,
      })
      .catch((error) => {
        message = 'Uh Oh, something went wrong. Try again later.';
      })
      .then((res) => {
        this.contactForm.reset();
      });
    await loader.dismiss();
    await this.app.showAlert({
      message,
      buttons: [
        {
          text: 'Okay',
        },
      ],
    });

    this._location.back();
  }

  get name() {
    return this.contactForm.controls.name;
  }

  goBack() {
    this.navController.back();
  }

  private loadForm() {
    const user = this.storeService.loggedInUser.value || ({} as any);

    const contactInputs = {
      name: new FormControl(user.fullName || '', [
        Validators.required,
        Validators.minLength(1),
      ]),
      email: new FormControl(user.email || '', [
        Validators.required,
        Validators.pattern(EMAIL_REGEX),
      ]),
      message: new FormControl('', [
        Validators.required,
        Validators.minLength(this.contactMessageMinLength),
        Validators.maxLength(this.contactMessageMaxLength),
      ]),
      code: new FormControl('', [
        Validators.minLength(this.countryCodeMinLength),
      ]),
      number: new FormControl('', [Validators.minLength(this.numberMinLength)]),
    };
    this.contactForm = this.formBuilder.group(contactInputs);

    this.cdr.detectChanges();
  }
}
