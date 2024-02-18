export interface PaymentDetail {
  pubKey: string;
  total: number;
  currency: string;
}

export interface ReservationDTO {
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
  ship_cost: number;
  tax_name: string;
  tax_rate: number;
  tax_total: number;
  total: number;
}
