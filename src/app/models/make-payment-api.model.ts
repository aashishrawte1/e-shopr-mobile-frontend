export interface IPaymentDiscount {
  mode: 'gems' | 'coupon';
  details?: {
    couponCode: string;
  };
}
export interface IPaymentRequest {
  stripePaymentInfo: {
    methodId?: string;
    intentId?: string;
  };
  sessionId: string;
  shippingDetails: IShippingDetails;
  discount: IPaymentDiscount;
}

export interface IShippingDetails {
  name: string;
  email: string;
  address: string;
  postalCode: string;
  phone: {
    code: number;
    number: number;
  };
}
