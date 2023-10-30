import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PageRoutes } from '../constants';
import { endpoints } from '../constants/endpoints';
import { ApiResponse, ICartItem, IProductResult } from '../models';
import { CostBreakdown, CostMap } from '../models/CostMap.interface';
import { IMerchantStore } from '../models/MerchantStore.interface';
import { AppService } from './app.service';
import { RequestService } from './request.service';
import { StoreService } from './store.service';

@Injectable({ providedIn: 'root' })
export class ShoppingCartService {
  constructor(
    private storeService: StoreService,
    private appService: AppService,
    private navController: NavController,
    private requestService: RequestService
  ) {}

  async init() {
    this.fetchMyShoppingCart();
  }

  async addItem({
    merchantId,
    item,
  }: {
    merchantId: string;
    item: ICartItem | IProductResult;
  }) {
    const itemsMap = this.storeService.shoppingCart.getValue() || {};
    if (!(merchantId in itemsMap)) {
      itemsMap[merchantId] = {};
    }
    if (!(item.uniqueId in itemsMap[merchantId])) {
      itemsMap[merchantId][item.uniqueId] = {
        ...item,
        noteToSeller: '',
        count: 1,
      } as ICartItem;

      this.showAddToCartToast();
    } else {
      itemsMap[merchantId][item.uniqueId].count += 1;
    }

    this.storeService.shoppingCart.next(itemsMap);

    await this.updateCartItems();
    return true;
  }

  getCartItemDetailsWithIdAndCount(shoppingCart: IMerchantStore) {
    // Get Array of Products
    const cartItems = [];
    if (!shoppingCart) {
      return cartItems;
    }
    for (const merchantKey of Object.keys(shoppingCart)) {
      for (const productId of Object.keys(shoppingCart[merchantKey])) {
        const itemInCart = {
          productId: shoppingCart[merchantKey][productId].uniqueId,
          count: shoppingCart[merchantKey][productId].count,
          noteToSeller: shoppingCart[merchantKey][productId].noteToSeller,
        };
        cartItems.push(itemInCart);
      }
    }

    return cartItems;
  }

  showAddToCartToast() {
    this.appService.showToast({
      message: '🛒 Your product is added to cart.',
      position: 'bottom',
      cssClass: ['type-1-toast'],
      duration: 1500,
      buttons: [
        {
          side: 'end',
          cssClass: 'type-1-toast-action-button',
          text: 'View',
          handler: () => {
            this.navController.navigateForward(
              PageRoutes.fullUrls.shoppingCart
            );
          },
        },
      ],
    });
  }
  async removeItem({
    merchantId,
    item,
  }: {
    merchantId: string;
    item: ICartItem;
  }) {
    let itemsMap = await this.storeService.shoppingCart.getValue();
    if (itemsMap[merchantId][item.uniqueId].count > 1) {
      itemsMap[merchantId][item.uniqueId].count -= 1;
    } else {
      delete itemsMap[merchantId][item.uniqueId];
      if (!Object.keys(itemsMap[merchantId]).length) {
        delete itemsMap[merchantId];
      }

      if (!Object.keys(itemsMap).length) {
        itemsMap = null;
      }
    }
    this.storeService.shoppingCart.next(itemsMap);
    await this.updateCartItems();
    return true;
  }

  async getCostMapForCart(itemsMap: IMerchantStore): Promise<CostMap> {
    const costMap: CostMap = {};

    if (!itemsMap) {
      return costMap;
    }

    for (const merchantId of Object.keys(itemsMap)) {
      costMap[merchantId] = await this.getCostBreakdown(merchantId, itemsMap);
    }

    return costMap;
  }

  async getTotalItemCountInCart() {
    const itemsMap = this.storeService.shoppingCart.getValue();
    let count = 0;
    if (!itemsMap) {
      return count;
    }
    Object.keys(itemsMap)
      .map((merchantId) => itemsMap[merchantId])
      .forEach((items) => {
        count += Object.keys(items).reduce(
          (accumulator, key) => accumulator + +items[key].count,
          0
        );
      });

    return count;
  }

  async getCostBreakdown(
    merchantStoreId: string,
    itemsMap: IMerchantStore
  ): Promise<CostBreakdown> {
    const costs: { shipping: number; subtotal: number; total: number } = {
      shipping: 0,
      subtotal: 0,
      total: 0,
    };

    const itemsFromMerchant = Object.keys(itemsMap[merchantStoreId]).map(
      (itemKey) => itemsMap[merchantStoreId][itemKey]
    );
    const maxShippingCost = Math.max(
      ...itemsFromMerchant.map((item) => +item.delivery.fee)
    );

    costs.subtotal = itemsFromMerchant.reduce(
      (a, b) => a + +b.price * b.count,
      0
    );
    costs.shipping = maxShippingCost;
    costs.total = costs.subtotal + costs.shipping;

    return costs;
  }

  async updateCartItems() {
    const cartItems = this.getCartItemDetailsWithIdAndCount(
      this.storeService.shoppingCart.getValue()
    );
    return this.requestService.send<ApiResponse>(
      'POST',
      `${endpoints.updateCartItems}`,
      {
        body: {
          cartItems,
        },
      }
    );
  }

  async fetchMyShoppingCart() {
    if (!this.storeService.authFirebaseUser.data?.value?.uid) {
      return;
    }
    const { result, status } = await this.requestService.send(
      'GET',
      endpoints.getCartItems
    );
    if (status.code !== 200) {
      console.error(
        'could not fetch users cart items',
        this.storeService.loggedInUser.value?.uid
      );
    }

    this.storeService.shoppingCart.next(result);
    return result;
  }
}
