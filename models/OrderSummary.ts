import mongoose, { Schema, Document, Model } from "mongoose";

// Order Summary interface
export interface IOrderSummary extends Document {
  totalOrders: number;
  totalRevenue: number; // in cents
  pendingOrders: number;
  completedOrders: number;
  createdAt: Date;
}

const OrderSummarySchema: Schema<IOrderSummary> = new Schema(
  {
    totalOrders: { type: Number, required: true, default: 0 },
    totalRevenue: { type: Number, required: true, default: 0 }, // cents
    pendingOrders: { type: Number, required: true, default: 0 },
    completedOrders: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // only track when summary was created
);

const OrderSummary: Model<IOrderSummary> =
  mongoose.models.OrderSummary ||
  mongoose.model<IOrderSummary>("OrderSummary", OrderSummarySchema);

export default OrderSummary;
