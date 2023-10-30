import { BehaviorSubject } from 'rxjs';
import { IAvailableCountries, IMedia } from '.';
import { ExternalNavigationType } from './external-nav-type.model';
import { ActiveFilterItem } from './product.model';

export type TLocalConfigDataPropNames =
  | 'countryListConfig'
  | 'pageConfig'
  | 'productSearchFilterData';

export type TRemoteConfigDataPropNames =
  | 'playgroundData'
  | 'appVersionUpdate'
  | 'banners'
  | 'homePageFeaturedCategories';

export class AppData {
  pageConfig = new BehaviorSubject<PageConfig>(null);
  appVersionUpdate = new BehaviorSubject<AppVersionUpdateEntity>(null);
  banners = new BehaviorSubject<AppBanner[]>(null);
  productSearchFilterData = new BehaviorSubject<ISearchFilterSection[]>(null);
  countryListConfig = new BehaviorSubject<IAppConfigCountryListConfig>(null);
  homePageFeaturedCategories = new BehaviorSubject<
    Array<IHomePageFeaturedCategoriesConfig>
  >(null);
  playgroundData = new BehaviorSubject<IPlaygroundData>(null);
}

export class AppBanner {
  action?: ExternalNavigationType;
  media?: IMedia[];
  link?: string;
  data?: ActiveFilterItem;
  countries: Array<IAvailableCountries>;
}

export interface ISearchFilterSection {
  text: 'Categories' | 'Merchants' | 'Eco-Tags';
  list?: SearchFilterSectionListEntity[];
}
export interface SearchFilterSectionListEntity {
  text: string;
  icon?: string | null;
  list?: SearchFilterSectionCategorySection[];
  id?: string | null;
  avatar?: string | null;
  associatedTags?: string[];
}
export interface SearchFilterSectionCategorySection {
  text: string;
  associatedTags: string[];
}

export interface CategoryInfo {
  selected: boolean;
  text: string;
}

export interface ITable {
  key: string;
  value: boolean;
}

export class MarketPageData {
  headerText: string;
  categoryText: string;
  merchantText: string;
  sorting: ProductSorting[];
}

export type SortingType = 'best-match' | 'price-low-high' | 'price-high-low';
export class ProductSorting {
  selectionText: string;
  selectionValue: SortingType;
  selectionIndicatorText: string;
}
export class PageConfig {
  constants: AppConstants;
  componentData: ComponentData;
  appDownloadLink: DownloadLink;
  appShareReferralData: DeviceSharePluginData;
  appShareText: DeviceSharePluginData;
  userReviewPromptData: UserReviewPromptData;
  coinActionsConfig: {
    coinsEarnedToast: {
      actionButtonText: string;
      message: string;
    };
  };
  icons: AppConfigIcons;
}

export class IHomePageFeaturedCategoriesConfig {
  headerText: string;
  icon: string;
  type: string;
  data: {
    activeFilter: ActiveFilterItem;
  };
}
export class TurtlePicks {
  header: string;
  icon: string;
}
export interface AppConfigIcons {
  searchBirdImage: string;
  trendingSelectedImage: string;
  trendingUnSelectedImage: string;
  justForYouSelectedImage: string;
  justForYouUnSelectedImage: string;
  likeIconOutline: string;
  likeIconFilled: string;
  shareIcon: string;
  heartIconOutline: string;
  heartIconFilled: string;
  heartIconFilledWhite: string;
  turtleColorfulSVGIcon: string;
  filterProductIcon: string;
}
export interface IAppConfigCountryListConfig {
  defaultSelection: IAvailableCountries;
  countryList: Array<ICountryDetail>;
}

export interface ICountryDetail {
  countryName: IAvailableCountries;
  flagUrl: string;
  currencyFormat: string;
  isoCode: string;
  countryCode: number;
  regionalisationSupported: boolean;
}

export type TCountryDetailKeys = keyof ICountryDetail;

export class AppConstants {
  marketNumberOfTagsToShow: number;
  marketNumberOfMerchantsToShow: number;
  marketPopularProductsTagText: string;
  marketPopularProductsAssociatedTags: string[];
  marketJustForYouProductsAssociatedTags: string[];
  marketJustForYouTagText: string;
  marketNumberOfItemsToFetchAtOnce: number;
  homeNumberOfTagsToShow: number;
  homeTrendingProductStartIndex: number;
  homeNumberOfPopularProductsToShow: number;
  homeNumberOfProductsToShowInTodaysForageSection: number;
  homeNumberOfMerchantsToShow: number;
  homeNumberOfPopularArticlesToShow: number;
  productDetailDescriptionCharCountInLessShowMode: number;
  productdetailNumberOfProductsToPullForMerchant: number;
  productTileNumberOfCharsInTitle: number;
  productTitleNumberOfCharsInDescription: number;
  shoppingCartRecommendedProductsCount: number;
  termsAndConditionLink: string;
}

export class DeviceSharePluginData {
  dialogTitle: string;
  text: string;
}
export class UserReviewPromptData {
  appRateDialogData: {
    simpleMode: boolean;
    displayAppName: string;
    usesUntilPrompt: number;
    customLocale: {
      title: string;
      message: string;
      cancelButtonLabel: string;
      laterButtonLabel: string;
      rateButtonLabel: string;
    };
  };
  canShowPrompt: boolean;
  minNumberOfAppOpensBeforeCanShowPrompt: number;
}
export class ComponentData {
  chatPage: ChatPageData;
  checkoutPage: ICheckoutPageData;
  communityPage: CommunityPageData;
  contactUsPage: ContactUsPageData;
  creditPage: any;
  errorPage: ErrorPageData;
  helpPage: HelpPageData;
  homePage: HomePageData;
  loginPage: LoginPageData;
  marketPage: MarketPageData;
  merchantStorePage: any;
  mixedContentPage: any;
  notificationPage: any;
  ordersPage: OrdersPageData;
  likesPage: LikesPageData;
  playgroundPage: IPlaygroundPage;
  privacyPolicyPage: PrivacyPolicyPageData;
  productDetailPage: ProductDetailPageData;
  profilePage: ProfilePageData;
  registrationPage: RegistrationPageData;
  shoppingCartPage: ShoppingCartPageData;
  tabsPage: TabsPageData;
  activeDowntimeComponent: ActiveDowntimeComponent;
  addCommentComponent: any;
  articleTileComponent: any;
  articleViewerComponent: any;
  cartItemsSummaryComponent: any;
  codePushBundleDownloaderComponent: any;
  customModalComponent: any;
  customPopupComponent: any;
  customProgressBarComponent: any;
  fullScreenImageViewerComponent: any;
  imagePlaceholderComponent: any;
  merchantTileComponent: any;
  productTileComponent: any;
  tagTileComponent: any;
  tileSkeletonComponent: any;
  userProfileComponent: any;
  videoViewerComponent: any;
  productSearchFilterData: SearchPageComponentData;
  sideMenuComponentData: SideMenuComponentData;
}

export interface SideMenuComponentData {
  shareAppText: string;
  rateAppText: string;
  likedItemsMenuItemText: string;
}

export interface SearchPageComponentData {
  emptyResultText: string;
  makeAnotherSearchButtonText: string;
}

export class IPlaygroundPage {
  header: string;
}

export class ISpinTheWheelPageData {
  wheelSegments: ISegmentData[];
}

export class AppVersionUpdateEntity {
  prompt: AppUpdatePrompt;
  links: AppUpdateLinks;
  latestVersion: AppUpdateLatestVersion;
}
export class AppUpdatePrompt {
  header: string;
  subHeader?: string;
  message?: string;
  buttons: string[];
}
export class AppUpdateLinks {
  android: string;
  ios: string;
}
export class AppUpdateLatestVersion {
  playStoreVersion: number;
  appStoreVersion: number;
}

// Home Page Section
export interface HomePageData {
  marketSection: MarketSection;
  communitySection: CommunitySection;
  playGroundSection: IPlayGroundSection;
  todayForage: TodayForage;
  turtlePicks: TurtlePicks;
}
export interface MarketSection {
  header: string;
  viewMoreText: string;
  popularSection: PopularSection;
  merchantSection: MerchantSectionOrCategorySection;
  categorySection: MerchantSectionOrCategorySection;
  footerNote: string;
}
export interface PopularSection {
  header: string;
}
export interface MerchantSectionOrCategorySection {
  header: string;
}
export interface CommunitySection {
  header: string;
  viewMoreText: string;
}
export interface IPlayGroundSection {
  header: string;
}
export interface TodayForage {
  header: string;
  footerNote: string;
}

// Chat Page Section
export interface ChatPageData {
  header: string;
  registrationWelcomeMessage: string;
  productQueryMessage: string;
}

// CheckOut Page Section
export interface ICheckoutPageData {
  shoppingCart: ICheckoutPageDataShoppingCart;
  popupMessage: IPopupMessage;
}
export interface IPopupMessage {
  loadingInformation: string;
  pleaseWait: string;
  updatingShipping: string;
  makingPayment: string;
  cardNotAuthenticate: string;
  text: string;
  verifyVoucher: string;
  discountValueGreater: string;
  onlyOneDiscount: string;
  outOfStock: string;
  saveOrder: string;
}

export interface ICheckoutPageDataShoppingCart {
  header: string;
  priceInfo: ICheckoutPageDataShoppingCartPriceInfo;
  gems: string;
  coupon: IVoucher;
  shippingDetails: IShippingDetails;
  itemsContainerHeaderText: string;
}
export interface ICheckoutPageDataShoppingCartPriceInfo {
  subTotal: string;
  totalShippingFees: string;
  discount: string;
  totalPayment: string;
}
export interface IVoucher {
  couponIsInvalid: string;
  couponValue: string;
  couponButton: string;
}
export interface IShippingDetails {
  header: string;
  contactForm: ICheckoutPageDataContactForm;
  paymentInfo: PaymentInfo;
  footerButton: string;
}
export interface ICheckoutPageDataContactForm {
  labelEmail: string;
  emailRequiredError: string;
  emailValidationError: string;
  labelName: string;
  nameRequiredError: string;
  namePatternError: string;
  labelCountryCode: string;
  countryCodeRequiredError: string;
  labelNumber: string;
  numberRequiredError: string;
  labelShippingNote: string;
  labelAddress: string;
  addressRequiredError: string;
  labelZip: string;
  zipRequiredError: string;
}
export interface PaymentInfo {
  header: string;
  noPaymentNeeded: string;
  cardDetailsInfo: string;
}

// Community Page Section
export interface CommunityPageData {
  header: string;
}

// Contact Page
export interface ContactUsPageData {
  contactSection: ContactUsPageDataContactSection;
  defaultValue: ContactUsPageDefaultValues;
}
export interface ContactUsPageDataContactSection {
  header: string;
  contactForm: ContactUsPageDataContactForm;
}
export interface ContactUsPageDataContactForm {
  labelEmail: string;
  emailRequiredError: string;
  emailValidationError: string;
  labelName: string;
  nameRequiredError: string;
  namePatternError: string;
  labelCountryCode: string;
  labelNumber: string;
  countryCodeRequiredError: string;
  labelMessage: string;
  messageRequiredError: string;
  contactFormButton: string;
}
export interface ContactUsPageDefaultValues {
  contactMessageMinLength: number;
  contactMessageMaxLength: number;
  countryCodeMinLength: number;
  numberMinLength: number;
}

// Error Page
export interface ErrorPageData {
  header: string;
  subHeading: string;
}

// Login Page
export interface LoginPageData {
  loginPageSection: LoginPageSection;
}
export interface LoginPageSection {
  header: string;
  loginForm: LoginForm;
  socialLoginButtonText: SocialLoginButtonText;
}
export interface LoginForm {
  labelEmail: string;
  emailRequiredError: string;
  emailPatternError: string;
  labelPassword: string;
  passwordRequiredError: string;
  forgotPassword: string;
  button: IButton;
  loginFormFooter: string;
  createAccount: string;
}

// Order Page Section
export interface OrdersPageData {
  orderPageSection: OrderPageSection;
}
export interface OrderPageSection {
  header: string;
  orderInfo: OrderInfo;
  productInfo: ProductInfo;
  noOrderPlacedSection: OrderPageNoOrderPlacedSection;
}
export interface OrderInfo {
  orderReference: string;
  orderedAt: string;
  paymentMode: string;
}
export interface ProductInfo {
  totalShippingCost: string;
  subTotal: string;
  discount: string;
  totalPayment: string;
}
export interface OrderPageNoOrderPlacedSection {
  title: string;
  shopNowButton: string;
  separatorText: string;
}

// Privacy Policy Page

export interface PrivacyPolicyPageData {
  header: string;
  privacyPolicyInfo: string;
}

// Help Page Section
export interface HelpPageData {
  helpPageSection: HelpPageSection;
}
export interface HelpPageSection {
  header: string;
  question1: string;
  answer1: string;
  question2: string;
  answer2: string;
  question3: string;
  answer3: string;
  question4: string;
  answer4: string;
  question5: string;
  answer5: string;
}

// Product Detail Page

export interface IProgressBarTriggerCondition {
  id: 'scroll_start' | 'element_in_view';
  type: 'event' | 'element_in_view';
  triggerHint: string;
  config?: {
    elementSelector?: string;
  };
}
export interface ProductDetailPageData {
  productDetailSection: ProductDetailSection;
  productShareSection: ProductShareSection;
  progressBar: {
    barFillColor: string;
    duration: number;
    requiredTriggerCount: number;
    triggerConditions: Array<IProgressBarTriggerCondition>;
  };
  likeOptions: {
    hintForLikeText: string;
    hintForUnLikeText: string;
    toastOptions: {
      onProductLikeClickMessage: string;
      onProductUnLikeClickMessage: string;
      showToastActionButton: boolean;
      toastButtonText: string;
      toastShowDuration: number;
    };
  };
}
export interface ProductShareSection {
  shareMessageText: string;
  appDownloadLinkPromptText: string;
  messageWhenUserNotLoggedInText: string;
}
export interface ProductDetailSection {
  loginPrompt: LoginPrompt;
  showMore: string;
  showLess: string;
  separatorText: string;
  footer: Footer;
  countryListUrl: string;
}
export interface LoginPrompt {
  gemsText: string;
  loginBtn: string;
}
export interface Footer {
  greenConciergeText: string;
  shoppingCartText: string;
  footerBtnCart: string;
  footerBtnBuy: string;
}

// Profile Page Section
export interface ProfilePageData {
  profilePageSection: ProfilePageSection;
}
export interface ProfilePageSection {
  header: string;
  profileDetail: ProfileDetail;
  coinWallet: CoinWallet;
}
export interface ProfileDetail {
  labelName: string;
  labelEmail: string;
  saveButton: string;
  emailPatternError: string;
  loginRequiredErrorMessage: string;
  emailInUsedErrorMessage: string;
  emailUpdateSuccessful: string;
}
export interface CoinWallet {
  header: string;
  gems: string;
  howToEarnCoin: string;
  earnCoinMission: string;
  earnCoinMissionBtn: string;
  claimDailyReward: string;
  claimDailyRewardBtn: string;
  shareWithFriends: string;
  shareWithFriendsBtn: string;
  refersAndWin: string;
  refersAndWinBtn: string;
}

// Register Page

export interface RegistrationPageData {
  registrationPageSection: RegistrationPageDataRegistrationPageSection;
}
export interface RegistrationPageDataRegistrationPageSection {
  header: string;
  registerForm: RegistrationPageDataRegistrationPageSectionRegisterForm;
  socialLoginButtonText: SocialLoginButtonText;
  haveAccountText: string;
  haveAccountLoginButtonText: string;
}
export interface RegistrationPageDataRegistrationPageSectionRegisterForm {
  labelEmail: string;
  emailRequiredError: string;
  emailPatternError: string;
  labelPassword: string;
  passwordRequiredError: string;
  button: IButton;
}
export interface IButton {
  loginWithEmail: string;
}
export interface SocialLoginButtonText {
  facebook: string;
  google: string;
  apple: string;
  skip?: string;
}

// Shopping Cart

export interface ShoppingCartPageData {
  shoppingCartPageSection: ShoppingCartPageSection;
}
export interface ShoppingCartPageSection {
  header: string;
  priceInfo: ShoppingCartPageSectionPriceInfo;
  hasNoItem: HasNoItem;
}
export interface ShoppingCartPageSectionPriceInfo {
  subtotal: string;
  checkoutButton: string;
}
export interface HasNoItem {
  title: string;
  hasNoItemBtn: string;
  separator: string;
}

// Tab Page
export interface TabsPageData {
  tabsIconHomeText: string;
  tabsIconMarketplaceText: string;
  tabsIconCommunityText: string;
  tabsIconCartText: string;
  barteringIconBottomText: string;
  tabsIconChat: string;
}

// Active Downtime Component
export interface ActiveDowntimeComponent {
  header: string;
  message: string;
}

// Wheel Segment
export interface ISegmentData {
  fillStyle: string;
  textFillStyle?: string;
  text: string;
  data: {
    tags?: Tags;
    table?: Table;
    action: string;
  };
}
export interface Tags {
  [key: string]: boolean;
}
export interface Table {
  [key: string]: boolean;
}

export interface IPlaygroundData {
  playGroundSectionItems: IPlayGroundSectionItem[];
  spinTheWheel: ISpinTheWheelPageData;
}

export interface IPlayGroundSectionItem {
  data: IPlayGroundSectionItemData;
  itemTileImageUrl: string;
  text: string;
  redirectTo?: string;
  action: 'goToPage' | 'fullScreenImage' | 'video';
}
export interface IPlayGroundSectionItemData {
  fullScreenImageUrl: any;
  videoUrl?: string;
  chartEmbedLink?: string;
}

// Download Link
export class DownloadLink {
  oneLink: string;
}

// Likes Page Data
export interface LikesPageData {
  likesPageSection: LikesPageSection;
}
export interface LikesPageSection {
  headerText: string;
  noItemsLikedSection: NoItemsLikedSection;
}
export interface NoItemsLikedSection {
  titleText: string;
  shopNowButtonText: string;
}
