// Used to display the options needed to filter a product
import {SarreCurrency, Variant} from "@/app/global-utils";

export interface ProductDetail {
  name: string;
  currency: string;
  price: number;
  desc: string;
  colour: string;
  urls: string[];
  variants: Variant[];
}

export interface CartDTO {
  sku: string;
  qty: number;
}

export interface Cart {
  product_id: string;
  url: string;
  product_name: string;
  price: number;
  currency: SarreCurrency;
  colour: string;
  size: string;
  sku: string;
  qty: number;
}
