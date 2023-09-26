// Used to display the options needed to filter a product
import {Variant} from "../../global-utils";

export interface Filter<T> {
  isOpen: boolean;
  parent: string;
  children: T[];
}

export interface Category {
  category: string;
  id: string;
}

export interface Collection {
  collection: string;
  id: string;
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


