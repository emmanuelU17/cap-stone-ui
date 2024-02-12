export interface ShippingDTO {
  country: string;
  ngn_price: number;
  usd_price: number;
}

export interface ShipSettingMapper extends ShippingDTO {
  shipping_id: number;
}

export interface TaxSetting {
  tax_id: number;
  name: string;
  rate: number;
}
