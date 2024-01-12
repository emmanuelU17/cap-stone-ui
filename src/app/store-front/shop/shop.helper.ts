// Used to display the options needed to filter a product
import {Variant} from "../../global-utils";

export interface Filter<T> {
  isOpen: boolean;
  parent: string;
  children: T[];
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

export const DUMMY_IMAGES: string[] = [
  'assets/image/15353DF6-99B9-4099-9000-5AC49618910C.jpg',
  'assets/image/b197e419-0733-43ba-a3d0-030e98e80f93.jpg',
  'assets/image/CE9FD4F1-9668-4ECC-AD51-4BE45B517574.jpg',
  'assets/image/e274e245-7b44-485c-9815-e1adf8e3eee8.jpg',
  'assets/image/e274e245-7b44-485c-9815-e1adf8e3eee8.jpg',
  'assets/image/IMG_1222.PNG',
  'assets/image/IMG_1223.PNG',
  'assets/image/IMG_1345.JPG',
  'assets/image/IMG_1380.JPG',
  'assets/image/IMG_1591.PNG',
  'assets/image/IMG_1592.PNG',
  'assets/image/IMG_1715.JPG',
  'assets/image/IMG_2943.PNG',
  'assets/image/IMG_3241.PNG',
  'assets/image/IMG_3393.JPG',
  'assets/image/IMG_3605.JPG',
  'assets/image/IMG_3606.JPG',
  'assets/image/IMG_4390.PNG',
  'assets/image/IMG_4477.JPG',
  'assets/image/IMG_4497.JPG',
  'assets/image/IMG_4527.JPG',
  'assets/image/IMG_4574.JPG',
  'assets/image/IMG_4575.JPG',
  'assets/image/IMG_4760.JPG',
  'assets/image/IMG_5149.JPG',
  'assets/image/IMG_5488.JPG',
  'assets/image/IMG_5900.PNG',
  'assets/image/IMG_6649.JPG',
  'assets/image/IMG_6689.JPG',
  'assets/image/IMG_6743.JPG',
  'assets/image/IMG_6744.JPG',
  'assets/image/IMG_6761.JPG',
  'assets/image/IMG_6763.JPG',
  'assets/image/IMG_6841.JPG',
  'assets/image/IMG_6896.JPG',
  'assets/image/sarre1.jpg',
  'assets/image/sarre2.jpg',
  'assets/image/sarre3.jpg',
];
