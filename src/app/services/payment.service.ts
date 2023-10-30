import { Injectable } from '@angular/core';
import { IPaymentRequest, IShippingAddressEntity } from '../models';
import { ApiService } from './api.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(
    private apiService: ApiService,
    private storeService: StoreService
  ) {}

  saveOrder(orderData: any) {
    return this.apiService.saveOrder(orderData);
  }

  async updateCoupon(couponCode: string) {
    await this.apiService.updateCoupon(couponCode);
  }

  async updateShippingAddress(data: { shipping: IShippingAddressEntity }) {
    await this.apiService.updateShippingAddress({ address: data.shipping });
  }

  async getShippingDetail() {
    const shippingAddress = await this.apiService.fetchShippingAddress();
    let shipping: IShippingAddressEntity;
    if (shippingAddress && shippingAddress.result) {
      shipping = shippingAddress.result;
    } else {
      shipping = {} as IShippingAddressEntity;
    }
    await this.storeService.shippingAddress.next(shipping);
    return shipping;
  }

  async makePayment({ requestData }: { requestData: IPaymentRequest }) {
    return await this.apiService.makePayment({
      data: requestData,
      timeout: 180000,
    });
  }

  async verifyVoucher(couponCode: string) {
    const response = await this.apiService.verifyVoucher({
      couponCode,
    });
    return response;
  }

  async getMyOrders() {
    const response = await this.apiService.fetchMyOrders();
    await this.storeService.myOrders.next(response.result);
    return response.result;
  }
}
