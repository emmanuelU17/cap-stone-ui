// Used to display the options needed to filter a product
export interface Filter<T> {
  isOpen: boolean;
  parent: string;
  children: T[];
}

export interface Category {
  category: string;
}

export interface Collection {
  collection: string;
}

export interface ProductDetail {
  name: string;
  currency: string;
  price: number;
  desc: string;
  sku: string;
  size: string;
  colour: string;
  url: string[];
}
