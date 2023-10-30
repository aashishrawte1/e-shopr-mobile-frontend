import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PageRoutes } from '../../constants';
import { endpoints } from '../../constants/endpoints';
import { ApiResponse } from '../../models';
import { ApiService } from '../../services/api.service';
import { AppService } from '../../services/app.service';
import { RequestService } from '../../services/request.service';
import { StoreService } from '../../services/store.service';
import {
  IBarteringProductDetailsApiResponse,
  IBarteringProductsApiResponse,
} from './bartering.model';

interface IAddProductFormData {
  images: Array<string>;
  title: string;
  description: string;
  priceMin: number;
  priceMax: number;
}

@Injectable({
  providedIn: 'root',
})
export class BarteringService {
  constructor(
    private requestService: RequestService,
    private apiService: ApiService,
    private storeService: StoreService,
    private appService: AppService,
    private navController: NavController
  ) {}

  init() {
    this.getAllProductsPostedByUser();
  }

  async getAllProductsPostedByUser() {
    const response = await this.requestService.send<IBarteringProductsApiResponse>(
      'GET',
      `${endpoints.barteringGetAllProductsAddedByCurrentUser}`
    );

    this.storeService.barteringProductByUser.next(response.result);
    return response.result;
  }

  async getRelevantProductsForCurrentSelectedProduct(data: {
    selectedProductId: string;
  }) {
    const queryString = this.apiService.createQueryString(data);
    const {
      result = [],
      status,
    } = await this.requestService.send<IBarteringProductsApiResponse>(
      'GET',
      `${endpoints.barteringGetRelevantProducts}/?${queryString}`
    );

    if (status.code !== 200) {
      console.error('Got error as relevant products api threw error');
      return;
    }
    const randomSequence = this.appService.getRandomItems(
      result,
      result?.length
    );
    this.storeService.relevantProductsMap.next({
      ...this.storeService.relevantProductsMap.value,
      [`${data.selectedProductId}`]: randomSequence,
    });

    return randomSequence;
  }

  async fetchMyProfile(data: { uniqueId: string }) {
    const queryString = this.apiService.createQueryString(data);
    const url = `${endpoints.getUserProfile}/?${queryString}`;
    return this.requestService.send<IBarteringProductsApiResponse>('GET', url);
  }

  async getMatchesForCurrentSelectedProduct(data: { sourceProductId: string }) {
    const queryString = this.apiService.createQueryString(data);
    const response = await this.requestService.send<IBarteringProductsApiResponse>(
      'GET',
      `${endpoints.barteringGetMatches}/?${queryString}`
    );
    this.storeService.matchedProducts.next({
      ...this.storeService.matchedProducts.value,
      [`${data.sourceProductId}`]: response.result,
    });
    return response.result;
  }

  async fetchProductByProductId(body: { productId: string }) {
    const url = `${
      endpoints.barteringGetProductDetail
    }/?${this.apiService.createQueryString(body)}`;
    const response = await this.requestService.send<IBarteringProductDetailsApiResponse>(
      'GET',
      url
    );
    return response.result;
  }

  async fetchProductDetailWithRelevance(body: {
    sourceProductId: string;
    targetProductId: string;
  }) {
    const url = `${
      endpoints.barteringGetProductDetailWithRelevance
    }/?${this.apiService.createQueryString(body)}`;
    const response = await this.requestService.send<IBarteringProductDetailsApiResponse>(
      'GET',
      url
    );
    return response.result[0];
  }

  async updateProductLikedByUser(body: {
    sourceProductId: string;
    targetProductId: string;
  }) {
    return this.requestService.send<ApiResponse>(
      'POST',
      `${endpoints.barteringLikeProduct}`,
      {
        body,
      }
    );
  }
  async modifyProduct(productData: IAddProductFormData) {
    return this.requestService.send<ApiResponse>(
      'POST',
      `${endpoints.barteringModifyProduct}`,
      {
        body: {
          productData,
        },
      }
    );
  }

  async deleteProduct(data: { productId: string }) {
    const queryString = this.apiService.createQueryString(data);
    const url = `${endpoints.barteringDeleteProduct}/?${queryString}`;
    return await this.requestService.send<ApiResponse>('GET', url);
  }

  async ignoreProduct(ignoredData: any) {
    return this.requestService.send<ApiResponse>(
      'POST',
      `${endpoints.barteringIgnoreProduct}`,
      {
        body: {
          ignoredData,
        },
      }
    );
  }

  async chooseImage() {
    return await this.appService.getImage({
      quality: 80,
      height: 400,
      width: 500,
    });
  }

  goToProductDetailPage({
    sourceProductId,
    targetProductId,
    sourceProductImage,
  }: {
    sourceProductId: string;
    targetProductId: string;
    sourceProductImage: string;
  }) {
    this.navController.navigateForward(
      `${PageRoutes.fullUrls.barteringProductDetail}?targetProductId=${targetProductId}&sourceProductId=${sourceProductId}&sourceProductImage=${sourceProductImage}`
    );
  }
}
