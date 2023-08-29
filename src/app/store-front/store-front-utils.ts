export interface Product {
  id: string;
  image: string;
  name: string;
  desc: string;
  currency: string;
  price: number;
  category?: string;
  collection?: string;
}
