export interface OrderHistoryDTO {
  date: number,
  total: number,
  orderNumber: string,
  payload: PayloadMapper[]
}

export interface PayloadMapper {
  name: string,
  url: string,
  currency?: string
  colour: string
}
