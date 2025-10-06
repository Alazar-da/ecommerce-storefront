import { CartItem } from "./CartItem";
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}
