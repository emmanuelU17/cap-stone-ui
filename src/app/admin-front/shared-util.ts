export interface UpdateProduct {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: string;
  collection: string;
}

export interface ProductResponse {
  collection: string;
  category: string;
  id: string;
  name: string;
  desc: string;
  price: number;
  currency: string;
  image: string;
  action: string;
}

export interface ProductDetail {
  url: string[];
  sku: string;
  is_visible: boolean;
  qty: number;
  size: string;
  action: string;
}

export interface UpdateDetail {
  sku: string;
  is_visible: boolean;
  qty: number;
  size: string;
}

export interface CategoryRequest {
  name: string;
  parent: string;
  visible: boolean;
}

export interface CategoryResponse {
  id: number
  category: string;
  created_at?: number;
  modified_at?: number;
  visible: boolean;
  action: string;
}

export interface CollectionRequest {
  name: string;
  visible: string;
}

export interface CollectionResponse {
  collection: string;
  visible: string;
  created_at: number;
  modified_at: number;
  action: string;
}

export interface TableContent<T> {
  key: string;
  data: T;
}

export interface PageChange {
  page: number;
  size: number;
}

export enum Components {
  dashboard = 'dashboard',
  new_product= 'new_product',
  new_category= 'new_category',
  new_collection= 'new_collection',
  product= 'product',
  category= 'category',
  collection= 'collection',
  customer= 'customer',
  detail='detail',
  register='register'
}

export interface CSRF {
  token: string;
  parameterName: string;
  headerName: string;
}

/** Needed in new product */
export interface ImageFilter {
  url: string;
  name: string;
}

export interface SizeInventory {
  size: string;
  qty: number;
}
