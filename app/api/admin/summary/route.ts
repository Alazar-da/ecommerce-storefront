import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import OrderSummary from "@/models/OrderSummary";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User"; // optional if you track customers

// 🟢 GET — fetch the current summary
export async function GET() {
  try {
    await connectDB();
    const summary = await OrderSummary.findOne({});
    if (!summary)
      return NextResponse.json({ message: "No summary found" }, { status: 404 });

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error fetching summary:", error);
    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 });
  }
}

export async function PUT() {
  try {
    await connectDB();

    const orders = await Order.find({});
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.status === "completed")
      .reduce((acc, o) => acc + o.totalAmount, 0);

    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const completedOrders = orders.filter((o) => o.status === "completed").length;
    const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
    const refundedOrders = orders.filter((o) => o.status === "refunded").length;
    const shippedOrders = orders.filter((o) => o.status === "shipped").length;

    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: { $ne: "admin" } });

    const summary = await OrderSummary.findOneAndUpdate(
      {},
      {
        totalOrders,
        totalRevenue,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        refundedOrders,
        shippedOrders,
        totalProducts,
        totalCustomers,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: "Order summary recalculated successfully",
      summary,
    });
  } catch (error) {
    console.error("Error creating/updating summary:", error);
    return NextResponse.json({ error: "Failed to update summary" }, { status: 500 });
  }
}


// 🟣 PATCH — for incremental updates (used by updateStatus)
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const updates = await req.json();

    const summary = await OrderSummary.findOneAndUpdate({}, updates, {
      new: true,
      upsert: true,
    });

    return NextResponse.json({ message: "Summary updated", summary });
  } catch (error) {
    console.error("Error updating summary:", error);
    return NextResponse.json({ error: "Failed to update summary" }, { status: 500 });
  }
}
