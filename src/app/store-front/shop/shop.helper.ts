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

export enum SESSION_STORAGE_KEY {
  PRODUCT = 'PRODUCT'
}
