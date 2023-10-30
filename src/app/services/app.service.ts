import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {
  CameraPhoto,
  CameraResultType,
  CameraSource,
  Plugins,
} from '@capacitor/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { ActionSheetOptions, AlertOptions, LoadingOptions } from '@ionic/core';
import { format, formatDistanceToNow, formatISO, parseISO } from 'date-fns';
import { BehaviorSubject, from } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomToastOptionsEntity, IRangeTracker } from '../models';
import {
  AppBanner as AppNavData,
  IAppConfigCountryListConfig,
  TCountryDetailKeys,
} from '../models/app-data.model';
import { ApiService } from './api.service';
import { StoreService } from './store.service';

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(
    private toastCtrl: ToastController,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    public toastController: ToastController,
    private apiService: ApiService,
    private alertController: AlertController,
    private httpClient: HttpClient,
    private angularRouter: Router,
    private _location: Location,
    private ngZone: NgZone,
    private storeService: StoreService
  ) {}

  async init() {}

  async showAlert(options?: AlertOptions) {
    const alertOptions: AlertOptions = Object.assign({}, options);

    if (!alertOptions.buttons) {
      alertOptions.buttons = [
        {
          text: 'Okay',
        },
      ];
    }
    const alert = await this.alertController.create(alertOptions);
    await alert.present();
    return alert;
  }

  async showActionSheet(options?: ActionSheetOptions) {
    const actionSheetOptions: ActionSheetOptions = Object.assign({}, options);
    const actionSheet = await this.actionSheetController.create(
      actionSheetOptions
    );
    await actionSheet.present();
    return actionSheet;
  }

  async getHeadlines() {
    return ['Global Warming On High.'];
  }

  async showToast(options: CustomToastOptionsEntity) {
    const cssClass = options.cssClass?.length
      ? [...options.cssClass, 'custom-toast']
      : ['custom-toast'];

    const toastOptions = Object.assign(
      {},
      {
        duration: 3000,
        closeButtonText: 'Close',
        position: 'below',
        animated: false,
        message: 'Default toast message.',
      },
      options
    );
    toastOptions.cssClass = cssClass;
    const toast = await this.toastCtrl.create(toastOptions);
    setTimeout(async () => {
      await toast.present();
    }, 1000);

    return toast;
  }

  async openFilePicker({
    quality,
    height,
    width,
  }: {
    quality: number;
    height: number;
    width: number;
  }) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { Camera } = Plugins;
    const image = await Camera.getPhoto({
      quality,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      height,
      width,
      source: CameraSource.Photos,
      preserveAspectRatio: true,
    });

    const base64Image = image;
    return base64Image;
  }

  async takePicture({
    quality,
    height,
    width,
  }: {
    quality: number;
    height: number;
    width: number;
  }) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { Camera } = Plugins;
    const image = await Camera.getPhoto({
      quality,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      height,
      width,
      source: CameraSource.Camera,
      preserveAspectRatio: true,
    });

    const base64Image = image;
    return base64Image;
  }

  async getImage({
    quality,
    height,
    width,
  }: {
    quality: number;
    height: number;
    width: number;
  }): Promise<string> {
    let actionSheet: HTMLIonActionSheetElement;
    const cameraData = await new Promise<CameraPhoto>(async (resolve) => {
      let data: Promise<CameraPhoto>;
      actionSheet = await this.actionSheetController.create({
        buttons: [
          {
            text: 'Choose from gallery',
            icon: 'images',
            handler: () => {
              data = this.openFilePicker({
                quality,
                height,
                width,
              });
              resolve(data);
            },
          },
          {
            text: 'Take a picture',
            icon: 'camera',
            handler: () => {
              data = this.takePicture({
                quality,
                height,
                width,
              });
              resolve(data);
            },
          },
          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
          },
        ],
      });
      await actionSheet.present();
    });
    if (actionSheet) {
      await actionSheet.dismiss();
    }
    return 'data:image/jpeg;base64,' + cameraData.base64String;
  }

  async showSpinner({ message }: { message: string }) {
    const options: LoadingOptions = {
      duration: 2000,
      message: message || 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      spinner: 'dots',
    };
    const loading = await this.loadingController.create(options);
    await loading.present();
    return loading;
  }

  async showLoader(
    loadingOptions?: LoadingOptions,
    message?: BehaviorSubject<string>
  ) {
    const options = Object.assign(
      {},
      {
        spinner: null,
        duration: 1500,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading',
      },
      loadingOptions
    );
    const loading = await this.loadingController.create(options);

    if (message) {
      if (message instanceof BehaviorSubject) {
        message
          .pipe(takeUntil(from(loading.onDidDismiss())))
          .subscribe((val) => {
            loading.message = val;
          });
      } else {
        loading.message = message;
      }
    }
    await loading.present();
    return loading;
  }

  randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * max) + min;
  }

  async sendMessage(contact: any) {
    const response = await this.apiService.postMessage({ contact });
    return response;
  }

  async getImageDataUri(data: { imageUrl: string }) {
    const imageBuffer = await this.httpClient
      .get(data.imageUrl, {
        responseType: 'arraybuffer',
        reportProgress: true,
      })
      .toPromise();
  }

  isEqual(a: any, b: any) {
    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);
    if (aProps.length !== bProps.length) {
      return false;
    }

    for (const prop of aProps) {
      if (a[prop] !== b[prop]) {
        return false;
      }
    }
    return true;
  }

  getISOTimestamp() {
    return formatISO(new Date(), {
      format: 'extended',
      representation: 'complete',
    }).toString();
  }

  getFormattedDate(formatType: string = 'dd-MMMM-yyyy') {
    return format(new Date(), formatType).toString();
  }

  isObjectEmpty(obj: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  getInitialRange({ incrementBy }: { incrementBy: number }) {
    const zeroRangeTracker = this.getZeroRangeTracker();
    return this.getNewProductRange({
      currentTracker: zeroRangeTracker,
      incrementBy,
    });
  }

  getZeroRangeTracker() {
    return {
      current: {
        start: 0,
        end: 0,
      },
      previous: null,
    };
  }

  getNewProductRange({
    currentTracker,
    incrementBy,
  }: {
    currentTracker: IRangeTracker;
    incrementBy: number;
  }): IRangeTracker {
    const range = JSON.parse(JSON.stringify(currentTracker));

    range.previous = Object.assign({}, range.current);
    range.current.start = range.previous.end;
    range.current.end = range.previous.end + incrementBy;
    return range;
  }

  getRandomItems(array: any[], n: number) {
    const result = new Array(n);
    let len = array.length;
    const taken = new Array(len);

    if (n > len)
      throw new RangeError('getRandom: more elements taken than available');
    while (n--) {
      const x = Math.floor(Math.random() * len);
      result[n] = array[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }

  formatNumberWithCommas(x: number) {
    if (!(x && x.toString().length)) {
      return;
    }
    const charArray = x.toString().split('').reverse();
    const strLength = x.toString().length;
    const newArray = [];
    for (const [index, ch] of Object.entries(charArray)) {
      newArray.push(ch);
      if ((!(strLength === +index + 1) && (+index + 1) % 3) === 0) {
        newArray.push(',');
      }
    }
    return newArray.reverse().join('');
  }

  handleAppNavigationData(appNavData: AppNavData) {
    if (
      appNavData.action === 'goToPage' ||
      appNavData.action === 'goToMarketTags' ||
      appNavData.action === 'filterByTags'
    ) {
      this.angularRouter.navigateByUrl(appNavData.link, {
        state: appNavData.data,
      });
      return;
    }
  }

  cloneObject(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  debounce(func: any, delay: number) {
    let inDebounce: any;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
  }

  getRouterState() {
    const state = this.cloneObject((this._location.getState() as any) || {});
    if (state?.navigationId) {
      delete state.navigationId;
    }

    if (this.isObjectEmpty(state)) {
      return null;
    }

    return state;
  }

  getCommaSeparatedTags(list: string[] | number[]) {
    return list.join(',').replace(/ /g, '');
  }

  scrollElementIntoView(selector: string) {
    this.ngZone.runOutsideAngular(() => {
      let searchTime = 0;
      const searchInterval = 30;
      const searchTill = 30000;
      const elementFinderInterval = setInterval(() => {
        const pageHeader = document.querySelector(selector) as any;

        if (pageHeader || searchTime >= searchTill) {
          clearInterval(elementFinderInterval);
          pageHeader?.scrollIntoView();
        }

        searchTime += searchInterval;
      }, searchInterval);
    });
  }

  getChatDisplayTime(time: string) {
    if (!time) {
      return;
    }
    try {
      time = new Date(time).toISOString();
    } catch (error) {
      time = new Date().toISOString();
    }
    const date = parseISO(time);
    return formatDistanceToNow(date, { addSuffix: true });
  }

  getCountryDetail({
    propName,
    valueToCompare,
  }: {
    propName: TCountryDetailKeys;
    valueToCompare: string;
  }) {
    if (!(propName && valueToCompare)) {
      return;
    }

    const countryListConfig = this.storeService.json.countryListConfig.value;

    return countryListConfig.countryList.find(
      (c) =>
        c[propName].toString().toLowerCase() === valueToCompare.toLowerCase()
    );
  }

  getCountrySpecificProp({
    propName,
    valueToCompare,
    propToGet,
  }: {
    propName: TCountryDetailKeys;
    valueToCompare: string;
    propToGet: TCountryDetailKeys;
  }): string {
    return this.getCountryDetail({ propName, valueToCompare })[
      propToGet
    ] as string;
  }

  getRegionalisationSupportedCountries() {
    return this.storeService.json.countryListConfig.value.countryList.filter(
      (f) => f.regionalisationSupported === true
    );
  }

  async openInAppBrowser({ url }: { url: string }) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { Browser } = Plugins;
    Browser.open({
      url,
    });
  }
}
