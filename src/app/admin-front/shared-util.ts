import {Variant} from "../global-utils";

export interface UpdateProduct {
  category_id: number;
  product_id: string;
  name: string;
  desc: string;
  currency: string;
  price: number;
  category: string;
}

export interface ProductResponse {
  category: string;
  product_id: string;
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
  index: number;
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
  category_id: number;
  category: string;
  created_at?: number;
  modified_at?: number;
  visible: boolean;
  action: string;
}

export interface UpdateCategory {
  category_id: number;
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

export interface SizeInventory {
  size: string;
  qty: number;
}

// https://stackoverflow.com/questions/13499025/how-to-show-ckeditor-with-basic-toolbar
export const CKEDITOR4CONFIG = {
  toolbar: [
    ['Format', 'Font', 'FontSize'],
    ['Bold', 'Italic', 'Underline', 'StrikeThrough'],
    ['NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
    ['Table', '-', 'Link']
  ],
  height: '100px'
};
