export interface UpdateVariant {
  sku: string;
  is_visible: boolean;
  qty: number;
  size: string;
}

export interface CustomUpdateVariant {
  productId: string;
  productName: string;
  variant: UpdateVariant;
}
