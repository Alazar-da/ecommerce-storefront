// models/Order.ts
import mongoose, { Schema, Document, Model } from "mongoose";

interface IOrderItem {
  productId: mongoose.Types.ObjectId | string;
  name: string;
  price: number; // cents
  quantity: number;
  imageUrl?: string;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId | string;
  items: IOrderItem[];
  totalAmount: number; // cents
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled" | "refunded";
  paymentIntentId?: string;
  paymentMethod?: string;
  refunded?: boolean;
  shipping?: {
    carrier?: string;
    trackingNumber?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true }, // cents
        quantity: { type: Number, required: true, min: 1 },
        imageUrl: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true }, // cents
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "completed", "cancelled", "refunded"],
      default: "pending",
    },
    paymentIntentId: { type: String },
    paymentMethod: { type: String },
    refunded: { type: Boolean, default: false },
    shipping: {
      carrier: { type: String },
      trackingNumber: { type: String },
    },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
