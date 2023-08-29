export interface CSRF {
  token: string;
  parameterName: string;
  headerName: string;
}

export interface AuthResponse {
  principal: string;
}

export interface State<T> {
  state: string;
  error?: string;
  data?: T;
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
