import { CartItem } from "./CartItem";
export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}
