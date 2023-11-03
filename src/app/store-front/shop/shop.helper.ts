// Used to display the options needed to filter a product
import {Variant} from "../../global-utils";

export interface Filter<T> {
  isOpen: boolean;
  parent: string;
  children: T[];
}

export interface Category {
  category: string;
  category_id: string;
}

export interface Collection {
  collection: string;
  collection_id: string;
}

export interface ProductDetail {
  name: string;
  currency: string;
  price: number;
  desc: string;
  colour: string;
  url: string[];
  variants: Variant[];
}

export enum SHOP_CONSTANT {
  PRODUCT = 'PRODUCT',
  CART = 'CART'
}

export interface CartExpiry {
  created: number;
  expire: number;
  cart: Cart[];
}

export interface CartDTO {
  sku: string;
  qty: number;
}

export interface Cart {
  url: string;
  product_name: string;
  price: number;
  currency: string;
  colour: string;
  size: string;
  sku: string;
  qty: number;
}

export const DUMMY_CART_DETAILS: Cart[] = [
  {
    url: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg',
    product_name: 'Throwback Hip Bag',
    price: 90.00,
    currency: 'USD',
    colour: 'salmon',
    qty: 2,
    size: '',
    sku: ''
  },
  {
    url: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
    product_name: 'Medium Stuff Satchel',
    price: 32.00,
    currency: 'USD',
    colour: 'blue',
    qty: 10,
    size: '',
    sku: ''
  },
];
