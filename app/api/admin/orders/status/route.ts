import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Order from "@/models/Order";
import Product from "@/models/Product";
import OrderSummary from "@/models/OrderSummary";

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const { status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing order ID or status" }, { status: 400 });
    }

    const order = await Order.findById(id).populate("items.productId");
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const prevStatus = order.status;

    // 🧾 Get or create the summary document
    let summary = await OrderSummary.findOne();
    if (!summary) {
      summary = await OrderSummary.create({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
      });
    }

    // 🧠 STATUS HANDLING LOGIC
    if (status === "completed") {
      // Subtract stock
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
          await product.save();
        }
      }

      // Update summary
      summary.completedOrders += 1;
      summary.totalRevenue += order.totalAmount;
    }

    if (status === "cancelled" || status === "refunded") {
      // Restore stock if previously completed
      if (prevStatus === "completed") {
        for (const item of order.items) {
          const product = await Product.findById(item.productId);
          if (product) {
            product.stock += item.quantity;
            await product.save();
          }
        }

        // Reduce revenue if previously added
        summary.totalRevenue -= order.totalAmount;
        summary.completedOrders = Math.max(0, summary.completedOrders - 1);
      }
    }

    if (status === "pending") {
      summary.pendingOrders += 1;
    }

    // 🧩 Keep totalOrders consistent
    summary.totalOrders = await Order.countDocuments();

    await summary.save();

    // ✅ Update order status
    order.status = status;
    await order.save();

    return NextResponse.json({
      message: "Order status updated successfully",
      order,
      summary,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
