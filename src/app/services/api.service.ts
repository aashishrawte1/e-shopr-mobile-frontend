import { Injectable } from '@angular/core';
import { endpoints } from '../constants/endpoints';
import {
  ApiResponse,
  IAddNewUserRequest,
  IGetProductsResponse,
  IGetProfileResponse,
  IGetShippingAddressResponse,
  IGetTurtlePicksResponse,
  IMedia,
  IPaymentRequest,
  IRegistrationWelcomeQuiz,
  IRegistrationWelcomeQuizStatusCheckApiResponse,
  IShippingAddressEntity,
  SingleProductApiResponse,
} from '../models';
import { SortingType } from '../models/app-data.model';
import { ICoinActionListApiResponse } from '../models/coin-action-list.model';
import { IGetTagsListResponse } from '../models/getTagsListResponse.interface';
import { IDeviceRequest } from '../models/IDevice';
import { IGetArticleItemsResponse } from '../models/IGetArticleItemsResponse';
import { IGetCouponResponse } from '../models/IGetCouponResponse';
import { IGetMixedDataResponse } from '../models/IGetMixedDataResponse';
import { IGetOrdersResponse } from '../models/IGetOrdersResponse';
import { IGetMerchantsResponse } from '../models/IMerchantResult';
import { IGetLoginProviderResponse } from './auth.service';
import { RequestService } from './request.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private requestService: RequestService) {}
  init() {}
  fetchProductsWithSearchTerms(options: {
    searchTerm: string;
    start: number;
    end: number;
    sorting: SortingType;
  }) {
    const url = `${endpoints.getProductBySearchTerm}/?${this.createQueryString(
      options
    )}`;
    return this.requestService.send<IGetProductsResponse>('GET', url);
  }

  saveOrder(orderData: any) {
    return this.requestService.send<ApiResponse>('POST', endpoints.saveOrder, {
      body: orderData,
    });
  }

  fetchJustForYouProducts(options: {
    start: number;
    end: number;
    sorting: SortingType;
  }) {
    const url = `${endpoints.getJustForYouProducts}/?${this.createQueryString(
      options
    )}`;
    return this.requestService.send<ApiResponse>('GET', url);
  }

  async updateShippingAddress(data: { address: IShippingAddressEntity }) {
    return this.requestService.send('POST', endpoints.updateShippingAddress, {
      body: data.address,
    });
  }
  async updateCoupon(couponCode: string) {
    return this.requestService.send('POST', endpoints.updateCoupon, {
      body: couponCode,
    });
  }

  updateNotificationStatus(data: {
    uniqueMessageId: string;
    openMode: 'receivedWhileAppWasOpen' | 'tappedOnNotificationToOpenIt';
  }) {
    return this.requestService.send<ApiResponse>(
      'POST',
      endpoints.updateNotificationStatus,
      {
        body: data,
      }
    );
  }
  fetchShippingAddress() {
    return this.requestService.send<IGetShippingAddressResponse>(
      'GET',
      endpoints.getShippingAddress
    );
  }
  makePayment(body: { data: IPaymentRequest; timeout: number }) {
    return this.requestService.send<ApiResponse>(
      'POST',
      endpoints.makePayment,
      {
        body: body.data,
        apiTimeout: body.timeout,
      }
    );
  }

  async fetchMyProfile(data: { uid: string }) {
    const queryString = this.createQueryString(data);
    const url = `${endpoints.getUserProfile}/?${queryString}`;
    return this.requestService.send<IGetProfileResponse>('GET', url);
  }

  // Product Related.
  fetchAllTags(): Promise<IGetTagsListResponse> {
    const url = endpoints.getPopularTagsList;
    return this.requestService.send<IGetTagsListResponse>('GET', url);
  }

  fetchPopularProducts(options: {
    start: number;
    end: number;
    sorting: SortingType;
  }): Promise<IGetProductsResponse> {
    const url = `${endpoints.getPopularProducts}/?${this.createQueryString(
      options
    )}`;
    return this.requestService.send<IGetProductsResponse>('GET', url);
  }
  fetchProductsForTags(options: {
    tags: string;
    start: number;
    end: number;
    sorting: SortingType;
  }): Promise<IGetProductsResponse> {
    const url = `${endpoints.getProductsWithFilters}/?${this.createQueryString(
      options
    )}`;
    return this.requestService.send<IGetProductsResponse>('GET', url);
  }

  fetchMixedData(options: {
    tags: string;
    table: string;
  }): Promise<IGetMixedDataResponse> {
    const url = `${endpoints.getMixedData}/?${this.createQueryString(options)}`;
    return this.requestService.send<IGetMixedDataResponse>('GET', url);
  }

  fetchProductByUniqueId(options: { uniqueId: string }) {
    const url = `${endpoints.getProductDetail}/?${this.createQueryString(
      options
    )}`;
    return this.requestService.send<SingleProductApiResponse>('GET', url);
  }

  fetchProductsByOwner(options: {
    ownerId: string;
    start: number;
    end: number;
    sorting: SortingType;
  }): Promise<IGetProductsResponse> {
    const url = `${endpoints.getProductsByOwner}/?${this.createQueryString(
      options
    )}`;
    return this.requestService.send<IGetProductsResponse>('GET', url);
  }

  fetchManyArticle(options: { start: number; end: number }) {
    const url = `${endpoints.getArticles}/?${this.createQueryString(options)}`;
    return this.requestService.send<IGetArticleItemsResponse>('GET', url);
  }
  fetchMerchantList(country: any) {
    const url = `${endpoints.getMerchantList}/?${this.createQueryString(
      country
    )}`;
    return this.requestService.send<IGetMerchantsResponse>('GET', url);
  }

  updateLastLogin() {
    return this.requestService.send('POST', `${endpoints.addLastLogin}`);
  }
  updateFullName(data: { fullName: string }) {
    return this.requestService.send('POST', `${endpoints.addFullName}`, {
      body: data,
    });
  }

  updateEmail({ email }: { email: string }) {
    return this.requestService.send('POST', `${endpoints.addEmail}`, {
      body: { email },
    });
  }

  updatePhone(phoneWithCountryCode: { code: number; number: number }) {
    return this.requestService.send('POST', `${endpoints.addPhone}`, {
      body: { phoneWithCountryCode },
    });
  }
  updateCountry({ data }: { data: any }) {
    return this.requestService.send('POST', `${endpoints.addUserCountry}`, {
      body: data,
    });
  }
  // User Page Related
  addProfileToDb({ image }: { image: IMedia }) {
    return this.requestService.send('POST', `${endpoints.addProfilePicture}`, {
      body: { avatar: image },
    });
  }

  addNewUser({ user }: { user: IAddNewUserRequest }) {
    return this.requestService.send<ApiResponse>(
      'POST',
      `${endpoints.createNewUser}`,
      { body: user }
    );
  }

  saveDeviceInfo({ data }: { data: IDeviceRequest }) {
    return this.requestService.send(
      'POST',
      `${endpoints.saveNotificationToken}`,
      {
        body: data,
      }
    );
  }

  fetchMyOrders() {
    return this.requestService.send<IGetOrdersResponse>(
      'GET',
      `${endpoints.getOrderListForUser}`
    );
  }

  fetchCoinActionList() {
    return this.requestService.send<ICoinActionListApiResponse>(
      'GET',
      `${endpoints.getCoinActionList}`
    );
  }

  // Contact Page Related
  postMessage({ contact }: { contact: any }) {
    return this.requestService.send(
      'POST',
      `${endpoints.sendMessageToGreenDay}`,
      {
        body: contact,
      }
    );
  }

  verifyVoucher(options: { couponCode: string }) {
    const url = `${endpoints.checkCoupon}/?${this.createQueryString(options)}`;
    return this.requestService.send<IGetCouponResponse>('GET', url);
  }
  fetchImageDataUri(data: { imageUrl: string }) {
    return this.requestService.send<string>('GET', data.imageUrl);
  }

  fetchLoginProvider(options: { email: string; provider: string }) {
    const { email, provider } = options;

    if (!(email || provider)) {
      return;
    }
    return this.requestService.send<IGetLoginProviderResponse>(
      'POST',
      `${endpoints.getLoginProviderApi}`,
      {
        body: options,
      }
    );
  }
  async fetchTodaysForageItems(options: {
    start: number;
    end: number;
    sorting: SortingType;
  }) {
    const url = `${endpoints.getForageItems}/?${this.createQueryString(
      options
    )}`;
    return this.requestService.send<IGetProductsResponse>('GET', url);
  }
  async fetchRelatedProducts(options: {
    start: number;
    end: number;
    tags: string;
    sorting: SortingType;
  }) {
    const url = `${endpoints.getRelatedProducts}/?${this.createQueryString(
      options
    )}`;
    return this.requestService.send<IGetProductsResponse>('GET', url);
  }

  async fetchLikedProducts() {
    return this.requestService.send<IGetProductsResponse>(
      'GET',
      `${endpoints.getLikedProductList}`
    );
  }

  async fetchTurtlePicks() {
    return this.requestService.send<IGetTurtlePicksResponse>(
      'GET',
      `${endpoints.getTurtlePicks}`
    );
  }

  async setProductLikeStatus({ uniqueId }: { uniqueId: string }) {
    return this.requestService.send<ApiResponse>(
      'POST',
      `${endpoints.setProductLikeStatus}`,
      {
        body: {
          uniqueId,
        },
      }
    );
  }

  async sendMessageForGreenConcierge(body: {
    chatType:
      | 'registration_welcome_message'
      | 'greenday_initiated_product_query_message'
      | 'green_concierge_user_message';
    productId?: string;
    message?: string;
  }) {
    return this.requestService.send<ApiResponse>(
      'POST',
      `${endpoints.postUserQueryToAdminThroughGreenConcierge}`,
      {
        body,
      }
    );
  }

  async getUsersWelcomeQuizResponseStatus() {
    return this.requestService.send<IRegistrationWelcomeQuizStatusCheckApiResponse>(
      'GET',
      `${endpoints.getUserRegistrationQuizResponseStatus}`
    );
  }

  async postRegistrationWelcomeQuizResponse(body: IRegistrationWelcomeQuiz) {
    return this.requestService.send<ApiResponse>(
      'POST',
      `${endpoints.postRegistrationWelcomeQuizResponse}`,
      {
        body,
      }
    );
  }

  async postBarteringMessage(body: {
    productIds: Array<string>;
    message: string;
  }) {
    this.requestService.send('POST', `${endpoints.postBarteringChatMessage}`, {
      body,
    });
  }

  createQueryString(obj: any) {
    let str = '';
    for (const [key, value] of Object.entries(obj || {}) as any) {
      str += `&${key}=${encodeURIComponent(value as string)}`;
    }

    return str;
  }
}
