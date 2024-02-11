export interface ShippingDTO {
  country: string;
  ngn_price: number;
  usd_price: number;
}

export interface ShippingSettingMapper extends ShippingDTO {
  shipping_id: number;
}
