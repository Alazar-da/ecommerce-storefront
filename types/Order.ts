import { CartItem } from "./CartItem";
import { User } from "./User";

export interface Order {
  _id: string;
  userId: User;
  items: CartItem[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled" | "refunded";
  paymentMethod?: string;
  paymentIntentId?: string;
  createdAt: string;
  updatedAt: string;
}
