import {Variant} from "../global-utils";

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

export interface ProductDetailResponse {
  colour: string;
  is_visible: boolean;
  url: string[];
  variants: Variant[],
}

export interface CustomRowMapper {
  colour: string;
  is_visible: boolean;
  url: string;
  urls?: string[];
  sku: string;
  inventory: number;
  size: string;
  action: string
}

export interface CategoryRequest {
  name: string;
  parent: string;
  visible: boolean;
}

export interface CategoryResponse {
  id: string;
  category: string;
  created_at?: number;
  modified_at?: number;
  visible: boolean;
  action: string;
}

export interface UpdateCategory {
  id: string;
  name: string;
  visible: boolean;
}

export interface CollectionRequest {
  name: string;
  visible: string;
}

export interface CollectionResponse {
  id: string;
  collection: string;
  visible: boolean;
  created_at: number;
  modified_at: number;
  action: string;
}

export interface UpdateCollection {
  id: string;
  name: string;
  visible: boolean;
}

export interface TableContent<T> {
  key: string;
  data: T;
}

export interface PageChange {
  page: number;
  size: number;
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
