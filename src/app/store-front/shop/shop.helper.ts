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

export interface Cart {
  url: string;
  name: string;
  price: number;
  currency: string;
  colour: string;
  qty: number;
}

export const DUMMY_CART_DETAILS: Cart[] = [
  {
    url: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg',
    name: 'Throwback Hip Bag',
    price: 90.00,
    currency: 'USD',
    colour: 'salmon',
    qty: 2
  },
  {
    url: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
    name: 'Medium Stuff Satchel',
    price: 32.00,
    currency: 'USD',
    colour: 'blue',
    qty: 10
  },
];
