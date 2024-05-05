export interface OrderHistoryDTO {
  date: number;
  currency: string;
  total: number;
  orderNumber: string;
  detail: PayloadMapper[];
}

export interface PayloadMapper {
  name: string;
  url: string;
  colour: string;
}
