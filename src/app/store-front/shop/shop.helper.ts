// Used to display the options needed to filter a product
import {Variant} from "../../global-utils";

export interface ProductDetail {
  name: string;
  currency: string;
  price: number;
  desc: string;
  colour: string;
  url: string[];
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
  currency: string;
  colour: string;
  size: string;
  sku: string;
  qty: number;
}
