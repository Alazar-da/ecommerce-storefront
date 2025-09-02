import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./User";
import { IProduct } from "./Product";

// Subdocument: Order item
interface IOrderItem {
  productId: IProduct["_id"];
  name: string;
  price: number; // store in cents
  quantity: number;
}

// Main Order interface
export interface IOrder extends Document {
  userId: IUser["_id"];
  items: IOrderItem[];
  totalAmount: number; // cents
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
