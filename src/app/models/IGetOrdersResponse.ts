import { ApiResponse } from '.';
import { IMerchantStore } from './MerchantStore.interface';
import { CostBreakdown } from './CostMap.interface';

export interface IGetOrdersResponse extends ApiResponse {
  result: IOrderResult[];
}

export interface IOrderResult {
  uniqueId: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ordered_at: string;
  referenceId: string;
  discount: number;
  discountType?: string;
  payment: IPaymentMode;
  products: IMerchantStore;
  finalCost?: CostBreakdown;
}

export interface IPaymentMode {
  mode: string;
  amount: number;
}
