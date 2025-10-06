import { CartItem } from "./CartItem";
export interface Cart {
  id: string;
  user: string;
  items: CartItem[];
  totalQuantity: number;
  total: number;
}
