import mongoose, { Schema, models } from "mongoose";

const OrderSummarySchema = new Schema(
  {
    totalRevenue: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    pendingOrders: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    cancelledOrders: { type: Number, default: 0 },
    refundedOrders: { type: Number, default: 0 },
    shippedOrders: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 },
    totalCustomers: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const OrderSummary =
  models.OrderSummary || mongoose.model("OrderSummary", OrderSummarySchema);

export default OrderSummary;
