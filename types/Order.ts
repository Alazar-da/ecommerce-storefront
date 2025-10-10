import { CartItem } from "./CartItem";
export interface Order {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled" | "refunded";
  paymentMethod?: string;
  paymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}
