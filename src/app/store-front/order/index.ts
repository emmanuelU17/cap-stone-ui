export interface PaymentDetail {
  reference: string;
  pub_key: string;
  total: number;
  currency: string;
}

export interface WebhookMetadata {
  principal: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  deliveryInfo: string;
}

export interface Checkout {
  principal: string;
  ship_cost: number;
  tax_name: string;
  tax_rate: number;
  tax_total: number;
  total: number;
  weight_detail: string;
  sub_total: string;
}
