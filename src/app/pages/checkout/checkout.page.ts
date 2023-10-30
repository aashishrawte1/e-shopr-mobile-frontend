import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { CustomGoogleTagManagerService } from '../../services/custom-google-tag-manager.service';
import { environment } from '../../../environments/environment';
import { NAME_REGEX, PageRoutes } from '../../constants';
import {
  ICartItem,
  IPaymentRequest,
  IShippingAddressEntity,
} from '../../models';
import {
  ICheckoutPageData,
  ICountryDetail,
  IPopupMessage,
} from '../../models/app-data.model';
import { CostMap } from '../../models/CostMap.interface';
import { gtmEventNames } from '../../models/gtm-event.model';
import { ICouponResult } from '../../models/IGetCouponResponse';
import { IMerchantStore } from '../../models/MerchantStore.interface';
import { AnalyticService } from '../../services/analytic.service';
import { AppConfigService } from '../../services/app-config.service';
import { AppService } from '../../services/app.service';
import { CoinService } from '../../services/coin.service';
import { PaymentService } from '../../services/payment.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { SmartLookService } from '../../services/smart-look.service';
import { StaticAssetService } from '../../services/static-asset.service';
import { StoreService } from '../../services/store.service';
import { UserProfileService } from '../../services/user-profile.service';
import PageObserverComponent from '../../utils/component-observer.util';
import { printFormValueAndValidity } from '../../utils/printFormValueAndValidity';
import { showActionModal } from '../../utils/showActionModal';
import { useSubject } from '../../utils/useSubject';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare let Stripe: stripe.StripeStatic;
@Component({
  selector: 'user-portal-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPageComponent
  extends PageObserverComponent
  implements OnInit {
  nameRegex = NAME_REGEX;
  elements: stripe.elements.Elements;
  cardNumber: stripe.elements.Element;
  cardExpiry: stripe.elements.Element;
  cardCvc: stripe.elements.Element;
  cardHasError = false;
  cardErrorMessage: string;
  stripe: stripe.Stripe;
  currentShippingDetail: IShippingAddressEntity;
  contactForm: FormGroup;
  couponError = '';
  savedErrors = {};
  couponResponse: ICouponResult;
  shoppingCart: IMerchantStore;
  showContactFormFormValidation: boolean;
  costBreakdown: { shipping: number; subtotal: number; total: number };
  costMapForStores: CostMap;
  finalCost: { subtotal: number; total: number; shipping: number };
  couponIsInvalid = false;
  couponIsInvalidForCurrentCountry = false;
  couponCode: string;
  paymentRequired = true;
  loader: HTMLIonLoadingElement;
  message = useSubject<string>('');
  couponValue = 0;
  couponDiscountType: '$' | '%';
  popupMessage: IPopupMessage;
  coinDiscountButtonText: 'Undo' | 'Apply' = 'Apply';
  coinInfo: {
    usersTotalCoin: number;
    eligibleCoinDiscountAfterApply: number;
    eligibleCoinDiscountOriginal: number;
    conversionRate: number;
    discountValueApplied: number;
    formattedCoinCount: string;
  } = {
    conversionRate: 1,
    discountValueApplied: 0,
    usersTotalCoin: 0,
    eligibleCoinDiscountOriginal: 0,
    eligibleCoinDiscountAfterApply: 0,
    formattedCoinCount: '',
  };
  pageConfig: ICheckoutPageData;
  selectedCountry: ICountryDetail;

  stepsInfo = {
    activeStep: 'step1',
    step1: {
      backButtonLeadsTo: 'shopping-cart',
      nextButtonText: 'Enter Payment Details',
      nextButtonLeadsTo: 'step2',
    },
    step2: {
      backButtonLeadsTo: 'step1',
      nextButtonText: 'Complete Payment',
      nextButtonLeadsTo: 'submit',
    },
  };
  discountMode: 'coupon' | 'gems';
  makePaymentRequestData: IPaymentRequest;

  constructor(
    public appService: AppService,
    private formBuilder: FormBuilder,
    private shoppingCartService: ShoppingCartService,
    public storeService: StoreService,
    private navController: NavController,
    public asset: StaticAssetService,
    private cdr: ChangeDetectorRef,
    private analytics: AnalyticService,
    private smartLookService: SmartLookService,
    public coinService: CoinService,
    private paymentService: PaymentService,
    public appConfigService: AppConfigService,
    private modalController: ModalController,
    public userService: UserProfileService,
    @Inject(DOCUMENT) private document: Document,
    private gtmService: CustomGoogleTagManagerService
  ) {
    super();
    this.stripe = Stripe(environment.stripePublishableKeys);
  }

  get email(): any {
    return this.contactForm.controls.email;
  }

  get name(): any {
    return this.contactForm.controls.name;
  }

  get address(): any {
    return this.contactForm.controls.address;
  }
  get postalCode(): any {
    return this.contactForm.controls.postalCode;
  }

  get countryCode(): any {
    return this.contactForm.controls.phone.get('code');
  }

  get phoneNumber(): any {
    return this.contactForm.controls.phone.get('number');
  }

  async ngOnInit() {
    this.observe(this.storeService.loggedInUser, (user) => {
      if (!user) {
        return;
      }

      this.selectedCountry = this.appService.getCountryDetail({
        propName: 'countryName',
        valueToCompare: user.country,
      });

      this.cdr.detectChanges();
    });
    this.observe(this.storeService.json.pageConfig, (config) => {
      this.pageConfig = config.componentData.checkoutPage;
      this.popupMessage = config.componentData.checkoutPage.popupMessage;
      this.cdr.detectChanges();
    });
    this.getCoinInfo();

    this.observe(this.storeService.shoppingCart, async (shoppingCart) => {
      this.shoppingCart = shoppingCart;
      if (!this.shoppingCart) {
        return;
      }

      this.costMapForStores = await this.shoppingCartService.getCostMapForCart(
        this.shoppingCart
      );
      this.finalCost = {
        subtotal: Object.values(this.costMapForStores).reduce(
          (accumulator, item) => accumulator + item.subtotal,
          0
        ),
        total: Object.values(this.costMapForStores).reduce(
          (accumulator, item) => accumulator + item.total,
          0
        ),
        shipping: Object.values(this.costMapForStores).reduce(
          (accumulator, item) => accumulator + item.shipping,
          0
        ),
      };

      this.cdr.detectChanges();
    });
    this.appService.showSpinner({
      message: this.popupMessage.loadingInformation,
    });
    this.currentShippingDetail =
      (await this.paymentService.getShippingDetail()) || ({} as any);

    const { code, number } = this.currentShippingDetail.phone || ({} as any);
    const countryCode = this.userService.getCountryCode();
    const shippingInformation = {
      name: [
        this.currentShippingDetail.name ||
          this.storeService.loggedInUser.value.fullName,
        [Validators.required],
      ],
      email: [
        this.currentShippingDetail.email ||
          this.storeService.loggedInUser.value.email,
        [Validators.required],
      ],
      address: [
        this.currentShippingDetail.address || '',
        [Validators.required],
      ],
      postalCode: [
        this.currentShippingDetail.postalCode || '',
        [Validators.required],
      ],
      phone: this.formBuilder.group({
        code: [code || countryCode, [Validators.required]],
        number: [number || '', [Validators.required]],
      }),
    };

    this.contactForm = this.formBuilder.group(shippingInformation);
    this.cdr.detectChanges();
  }

  ionViewWillEnter() {
    this.getCoinInfo();
  }

  async getCoinInfo() {
    const coinResponse = await this.coinService.syncCoinCount();
    this.coinInfo = {
      formattedCoinCount: this.appService.formatNumberWithCommas(
        coinResponse?.type1?.count
      ),
      usersTotalCoin: coinResponse?.type1?.count || 0,
      conversionRate: coinResponse?.type1?.coinConversionRate || 1,
      discountValueApplied: 0,
    } as any;
    this.coinInfo.eligibleCoinDiscountOriginal = +this.getCoinValue();
    this.coinInfo.eligibleCoinDiscountAfterApply = this.coinInfo.eligibleCoinDiscountOriginal;
    this.cdr.detectChanges();
  }

  async createLoader() {
    if (this.loader) {
      await this.loader.dismiss();
    }
    this.loader = await this.appService.showLoader(
      { backdropDismiss: false, showBackdrop: true, duration: 2 * 60 * 1000 },
      this.message
    );
  }

  onCardDetailChange(
    event: stripe.elements.ElementChangeResponse,
    field: string
  ) {
    if (event.error) {
      this.cardHasError = true;
      this.savedErrors[field] = event.error.message;
      this.cardErrorMessage = event.error.message;
    } else {
      this.savedErrors[field] = null;

      // Loop over the saved errors and find the first one, if any.
      const nextError = Object.keys(this.savedErrors)
        .sort()
        .reduce((maybeFoundError, key) => {
          return maybeFoundError || this.savedErrors[key];
        }, null);

      if (nextError) {
        // Now that they've fixed the current error, show another one.
        this.cardErrorMessage = nextError;
      } else {
        // The user fixed the last error; no more errors.
        this.cardHasError = false;
      }
    }
  }

  async showPaymentError({
    errorCode,
    errorMessage,
  }: {
    errorCode: string;
    errorMessage: string;
  }) {
    const alert = await this.appService.showAlert({
      message: errorMessage,
    });

    await alert.onDidDismiss();
  }

  async showOutOfStockError({
    items,
    errorMessage,
  }: {
    items: ICartItem[];
    errorMessage: string;
  }) {
    const alert = await this.appService.showAlert({
      message: errorMessage,
    });

    await alert.onDidDismiss();

    for (const item of items) {
      let itemCount = item.count;
      while (itemCount > 0) {
        this.shoppingCartService.removeItem({
          merchantId: item.owner,
          item,
        });
        itemCount -= 1;
      }
    }
  }

  getItemsInCart() {
    const items = [];
    Object.values(this.shoppingCart).forEach((store) => {
      items.push(...Object.values(store));
    });

    return items;
  }

  getIsPaymentRequired() {
    return this.getTotalPayment() > 0;
  }
  getRoundDownValue({
    decimalPlacesCount,
    numberToConvert,
  }: {
    decimalPlacesCount: number;
    numberToConvert: number;
  }) {
    return (
      Math.floor(
        (numberToConvert + Number.EPSILON) * Math.pow(10, decimalPlacesCount)
      ) / Math.pow(10, decimalPlacesCount)
    );
  }

  getTotalPayment() {
    let finalCost: number;

    const discountValue = this.getTotalDiscountApplied();

    finalCost = +(this.finalCost?.total - discountValue).toFixed(2);
    if (finalCost <= 0) {
      finalCost = 0;
    }
    return finalCost;
  }

  getTotalDiscountApplied() {
    let discountValue = 0;
    if (this.couponValue > 0) {
      if (this.couponDiscountType === '$') {
        discountValue = this.couponValue;
      } else if (this.couponDiscountType === '%') {
        discountValue = (this.couponValue / 100) * this.finalCost?.total;
      }
    } else if (this.coinInfo.discountValueApplied > 0) {
      discountValue = this.coinInfo.discountValueApplied;
    }

    return discountValue;
  }

  // COUPON LOGIC

  onCouponCodeChange(event: any) {
    this.couponIsInvalid = false;
    this.couponIsInvalidForCurrentCountry = false;
    this.couponResponse = {} as any;
    this.couponValue = 0;
    this.paymentRequired = this.getIsPaymentRequired();

    this.cdr.detectChanges();
  }

  async toggleCouponAppliedStatus(couponCode: number | string, undo?: boolean) {
    this.couponValue = 0;
    this.couponIsInvalid = false;
    this.couponIsInvalidForCurrentCountry = false;

    if (undo) {
      this.paymentRequired = this.getIsPaymentRequired();
      this.couponCode = '';
      couponCode = '';
    }
    if (!couponCode) {
      return;
    }

    this.appService.showLoader({
      message: this.popupMessage.verifyVoucher,
      duration: 2000,
    });
    const { result, status } = await this.paymentService.verifyVoucher(
      couponCode.toString().toLowerCase()
    );

    if (!(status.code === 200)) {
      this.couponIsInvalid = true;
      return;
    }

    this.couponResponse = result;

    if ('error' in result) {
      this.couponIsInvalidForCurrentCountry = true;
    } else {
      this.couponValue = this.couponResponse.couponValue;
      this.couponDiscountType = this.couponResponse.discountType;
      this.paymentRequired = this.getIsPaymentRequired();
    }
    this.cdr.detectChanges();

    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.checkoutPageVoucherApplyButtonClick,
        valueOfGemsApplied: this.couponValue,
      });
    } catch (error) {}
  }
  canApplyCouponDiscount() {
    if (this.coinInfo.discountValueApplied > 0) {
      return false;
    }

    return true;
  }

  // GEM LOGIC

  getCoinValue() {
    return (
      (+this.coinInfo.usersTotalCoin || 0) /
      (+this.coinInfo.conversionRate || 0)
    ).toFixed(4);
  }

  canApplyGemDiscount() {
    if (!!this.couponValue) {
      return false;
    }

    return this.coinInfo.eligibleCoinDiscountOriginal >= 0.01;
  }

  async toggleGemDiscountApply() {
    this.toggleCouponAppliedStatus('', true);
    const canApplyGemDiscount = this.canApplyGemDiscount();
    if (!canApplyGemDiscount) {
      return;
    }

    if (this.coinDiscountButtonText === 'Apply') {
      this.coinInfo.discountValueApplied = 0;
      this.coinDiscountButtonText = 'Undo';
      const currentTotalPayment = this.getTotalPayment();
      if (
        currentTotalPayment - this.coinInfo.eligibleCoinDiscountAfterApply <
        0
      ) {
        this.coinInfo.discountValueApplied = currentTotalPayment;
      } else {
        this.coinInfo.discountValueApplied = this.getRoundDownValue({
          numberToConvert: this.coinInfo.eligibleCoinDiscountAfterApply,
          decimalPlacesCount: 2,
        });
      }
    } else {
      this.coinInfo.discountValueApplied = 0;
      this.coinDiscountButtonText = 'Apply';
    }

    this.coinInfo.eligibleCoinDiscountAfterApply =
      +(
        this.coinInfo.eligibleCoinDiscountOriginal -
        this.coinInfo.discountValueApplied
      ).toFixed(4) || 0;
    this.coinInfo.usersTotalCoin = Math.round(
      this.coinInfo.eligibleCoinDiscountAfterApply < 0
        ? 0
        : this.coinInfo.eligibleCoinDiscountAfterApply *
            +this.coinInfo.conversionRate
    );

    this.paymentRequired = this.getIsPaymentRequired();
    this.discountMode = 'gems';
    this.cdr.detectChanges();

    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.checkoutPageGemApplyButtonClick,
        valueOfGemsApplied: this.coinInfo.discountValueApplied,
      });
    } catch (error) {}
  }

  shopNow() {
    this.navController.navigateBack(PageRoutes.fullUrls.market);
  }
  goBack() {
    const backPage = this.stepsInfo[this.stepsInfo.activeStep]
      .backButtonLeadsTo;
    if (backPage === 'shopping-cart') {
      this.navController.back();
      return;
    }

    this.stepsInfo.activeStep = backPage;
  }

  onNextButtonClick() {
    const nextPage = this.stepsInfo[this.stepsInfo.activeStep]
      .nextButtonLeadsTo;

    if (nextPage === 'submit') {
      try {
        this.gtmService.recordEvent({
          event: gtmEventNames.checkoutPagePaymentCompleteButtonClick,
          products: this.shoppingCartService.getCartItemDetailsWithIdAndCount(
            this.storeService.shoppingCart.getValue()
          ),
        });
      } catch (error) {}
      this.submitPayment();
      return;
    }

    if (this.stepsInfo.activeStep === 'step1') {
      if (this.contactForm.invalid) {
        this.showContactFormFormValidation = true;
        printFormValueAndValidity(this.contactForm);
        return;
      }

      try {
        this.gtmService.recordEvent({
          event: gtmEventNames.checkoutPageEnterPaymentDetailButtonClick,
          products: this.shoppingCartService.getCartItemDetailsWithIdAndCount(
            this.storeService.shoppingCart.getValue()
          ),
        });
      } catch (error) {}
    }

    this.stepsInfo.activeStep = nextPage;
    if (nextPage === 'step2') {
      this.setCardStyles();
    }
  }

  async setCardStyles() {
    const res = await new Promise<boolean>((resolve) => {
      let totalTimeToSearch = 15000;
      const intervalPeriod = 50;
      const interval = setInterval(() => {
        const cardNumberElement = this.document.querySelector('.card-number');
        const cardExpiryElement = this.document.querySelector('.card-expiry');
        const cardCVCElement = this.document.querySelector('.card-cvc');

        totalTimeToSearch -= intervalPeriod;

        if (totalTimeToSearch < 0) {
          clearInterval(interval);
          resolve(true);
        }

        if (!(cardExpiryElement && cardCVCElement && cardNumberElement)) {
          return;
        }

        clearInterval(interval);
        resolve(true);
      }, intervalPeriod);
    });

    if (res !== true) {
      return;
    }

    this.elements = this.stripe.elements({
      locale: 'auto',
    });

    const elementStyles = {
      base: {
        color: '#32325D',
        fontWeight: 500,
        fontSize: '16px',

        '::placeholder': {
          color: '#CFD7DF',
        },
        ':-webkit-autofill': {
          color: '#e39f48',
        },
      },
      invalid: {
        color: '#E25950',

        '::placeholder': {
          color: '#FFCCA5',
        },
      },
    };

    const elementClasses = {
      focus: 'focused',
      empty: 'empty',
      invalid: 'invalid',
    };

    this.cardNumber = this.elements.create('cardNumber', {
      style: elementStyles,
      classes: elementClasses,
    });

    this.cardNumber.on('change', (event) =>
      this.onCardDetailChange(event, 'cardNumber')
    );
    this.cardNumber.mount('#card-number');

    this.cardExpiry = this.elements.create('cardExpiry', {
      style: elementStyles,
      classes: elementClasses,
    });
    this.cardExpiry.on('change', (event) =>
      this.onCardDetailChange(event, 'cardExpiry')
    );
    this.cardExpiry.mount('#card-expiry');

    this.cardCvc = this.elements.create('cardCvc', {
      style: elementStyles,
      classes: elementClasses,
    });
    this.cardCvc.on('change', (event) =>
      this.onCardDetailChange(event, 'cardCvv')
    );
    this.cardCvc.mount('#card-cvc');
  }

  handleAction = async (clientSecret: string) => {
    const data = await this.stripe.handleCardAction(clientSecret);
    if (data.error) {
      this.appService.showAlert({
        message: this.popupMessage.cardNotAuthenticate,
        buttons: [
          {
            text: this.popupMessage.text,
          },
        ],
      });
    } else if (data.paymentIntent.status === 'requires_confirmation') {
      this.makePaymentRequestData.stripePaymentInfo = {
        intentId: data.paymentIntent.id,
      };
      const { status } = await this.paymentService.makePayment({
        requestData: this.makePaymentRequestData,
      });

      if (status.code !== 200) {
        this.appService.showAlert({
          message: status.description,
          buttons: [
            {
              text: this.popupMessage.text,
            },
          ],
        });
      } else {
        this.orderComplete();
      }
    }
  };

  /* Shows a success / error message when the payment is complete */
  orderComplete = async () => {
    this.shoppingCartService.fetchMyShoppingCart();
    try {
      this.gtmService.recordEvent({
        event: gtmEventNames.paymentCompleted,
        products: this.shoppingCartService.getCartItemDetailsWithIdAndCount(
          this.storeService.shoppingCart.getValue()
        ),
      });
    } catch (error) {}
    const modalRef = await showActionModal(
      this.modalController,
      'payment-successful'
    );
    modalRef.onWillDismiss().then((_) => {
      this.navController.navigateRoot(PageRoutes.fullUrls.orders, {
        replaceUrl: true,
      });
    });
  };

  async submitPayment() {
    if (this.contactForm.invalid) {
      this.showContactFormFormValidation = true;
      return;
    }

    this.paymentRequired = this.getIsPaymentRequired();

    if (this.cardHasError && this.paymentRequired) {
      this.showContactFormFormValidation = true;
      return;
    }

    await this.shoppingCartService.updateCartItems();
    this.message = useSubject<string>(this.popupMessage.pleaseWait);
    await this.createLoader();

    if (
      !this.appService.isEqual(
        this.contactForm.value,
        this.currentShippingDetail
      )
    ) {
      this.message.next(this.popupMessage.updatingShipping);
      await this.paymentService.updateShippingAddress({
        shipping: this.contactForm.value,
      });
      this.currentShippingDetail = this.contactForm.value;
    }

    const orderData = { stripePaymentInfo: {} } as IPaymentRequest;
    if (
      this.couponResponse &&
      this.couponResponse.couponCode === this.couponCode.toUpperCase()
    ) {
      orderData.discount = {
        mode: 'coupon',
        details: {
          couponCode: this.couponCode.toUpperCase(),
        },
      };
    } else if (this.coinInfo.discountValueApplied > 0) {
      orderData.discount = {
        mode: 'gems',
      };
    }

    const dataToSendForAnalytics = {
      items: this.getItemsInCart().map((item) => ({
        itemId: item.uniqueId,
        itemTitle: item.title,
      })),
      finalCost: this.finalCost,
    };
    this.analytics.logEvent(
      this.storeService.analyticFacebookEvents.EVENT_NAME_INITIATED_CHECKOUT,
      dataToSendForAnalytics
    );
    this.smartLookService.logEvent({
      eventName: 'checkout',
      data: dataToSendForAnalytics,
    });

    // Collects card details and creates a PaymentMethod
    const country = this.userService.getUsersCountry();

    let createPaymentMethodResponse = {} as any;
    if (this.paymentRequired) {
      createPaymentMethodResponse = await this.stripe.createPaymentMethod(
        'card',
        this.cardNumber,
        {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          billing_details: {
            address: {
              country: country === 'malaysia' ? 'my' : 'sg',
              city: country === 'malaysia' ? 'my' : 'sg',
              line1: `${this.contactForm.controls.address.value}`,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              postal_code: `${this.contactForm.controls.postalCode.value}`,
            },
            email: this.contactForm.controls.email.value,
            name: this.contactForm.controls.name.value,
            phone: `${this.phoneNumber.value}`,
          },
        }
      );

      if (createPaymentMethodResponse.error) {
        if (this.loader) {
          this.loader.dismiss();
        }
        this.appService.showAlert({
          message: createPaymentMethodResponse.error?.message,
          buttons: [
            {
              text: this.popupMessage.text,
            },
          ],
        });
        return;
      }
    }

    if (!this.appService.isObjectEmpty(createPaymentMethodResponse)) {
      orderData.stripePaymentInfo.methodId =
        createPaymentMethodResponse.paymentMethod?.id;
    }
    orderData.shippingDetails = this.contactForm.value;

    this.message.next(this.popupMessage.makingPayment);
    await this.createLoader();
    this.makePaymentRequestData = orderData;
    const makePaymentResponse = await this.paymentService.makePayment({
      requestData: this.makePaymentRequestData,
    });

    await this.loader.dismiss();
    const { status, result } = makePaymentResponse;
    if (status.code.toString() === this.popupMessage.outOfStock) {
      this.showOutOfStockError({
        errorMessage: status.description,
        items: result,
      });
    } else if (
      status.code.toString() === this.popupMessage.onlyOneDiscount ||
      status.code.toString() === this.popupMessage.discountValueGreater
    ) {
      this.showPaymentError({
        errorMessage: status.description,
        errorCode: status.code.toString(),
      });
    } else if (status.code !== 200) {
      this.appService.showAlert({
        message: status.description,
        buttons: [
          {
            text: this.popupMessage.text,
          },
        ],
      });
    } else if (result.requiresAction) {
      // Request authentication
      await this.handleAction(result.clientSecret);
    } else {
      this.orderComplete();
    }
  }
}
