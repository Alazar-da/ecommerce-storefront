import { Product } from "./Product";
export interface CartItem {
  _id: string;
  productId: Product;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}
