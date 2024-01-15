export const VARIABLE_IS_NUMERIC = (num: any): boolean =>
  (typeof (num) === 'number' || typeof (num) === 'string' && num.trim() !== '') && !isNaN(num as number);

export enum SarreCurrency {
  NGN = 'NGN', USD = 'USD',
  NGN_SYMBOL = '₦', USD_SYMBOL = '$'
}

export interface Link {
  name: string;
  path: string;
  bool?: boolean;
}

export interface AuthResponse {
  principal: string;
}

export interface Category {
  name: string;
  category_id: number;
  parent_id: number;
  visible: boolean;
  children: Category[];
}

export interface Variant {
  sku: string;
  inventory: string;
  size: string;
}

export interface SarreUser {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

export interface RegisterDTO {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  phone: string;
  password: string;
}

export interface Page<T> {
  content: T[],
  pageable: {
    sort: {
      empty: boolean,
      sorted: boolean,
      unsorted: boolean
    },
    offset: number,
    pageSize: number,
    pageNumber: number,
    unpaged: boolean,
    paged: boolean
  },
  last: boolean,
  totalPages: number,
  totalElements: number,
  size: number,
  number: number,
  sort: {
    empty: boolean,
    sorted: boolean,
    unsorted: boolean
  },
  numberOfElements: number,
  first: boolean,
  empty: boolean
}
