export interface PaymentDetails {
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
