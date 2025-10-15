// app/api/admin/analytics/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Order from "@/models/Order";
import Product from "@/models/Product";
import OrderSummary from "@/models/OrderSummary";

/**
 * GET /api/admin/analytics
 * query params:
 *  - days: number (defaults to 30) → range for time-series
 */
export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get("days") || "30", 10);
    const since = new Date();
    since.setDate(since.getDate() - days + 1); // inclusive

    // 1) Revenue time series (per day)
    const revenueAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: since }, status: "completed" } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: "$totalAmount" }, // make sure your field is totalAmount or adjust
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // build map of date->value for the last `days`
    const dateMap: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (days - 1 - i));
      const key = d.toISOString().slice(0, 10);
      dateMap[key] = 0;
    }
    revenueAgg.forEach((r: any) => {
      dateMap[r._id] = (r.total ?? 0);
    });
    const revenueDates = Object.keys(dateMap);
    const revenueValues = revenueDates.map((d) => dateMap[d]);

    // 2) Orders by status (pie)
    const ordersByStatusAgg = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const ordersByStatus: Record<string, number> = {};
    ordersByStatusAgg.forEach((s: any) => (ordersByStatus[s._id || "unknown"] = s.count));

    // 3) Top products by quantity sold (last `days`)
    const topProductsAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: since }, status: { $in: ["completed", "shipped", "completed"] } } },
      { $unwind: "$items" },
      { $group: { _id: "$items.productId", qty: { $sum: "$items.quantity" } } },
      { $sort: { qty: -1 } },
      { $limit: 10 },
    ]);

    // populate product names
    const topProducts = await Promise.all(
      topProductsAgg.map(async (p: any) => {
        const prod = await Product.findById(p._id).lean();
        return {
          productId: p._id,
          name: prod?.name || "Unknown product",
          qty: p.qty,
        };
      })
    );

    // 4) Low stock products (stock < threshold)
    const lowStockThreshold = 10;
    const lowStockProducts = await Product.find({ stock: { $lte: lowStockThreshold } })
      .select("name stock")
      .sort({ stock: 1 })
      .limit(10)
      .lean();

    // 5) Basic KPI summary from OrderSummary or compute fallback
    let summary = await OrderSummary.findOne().lean();
    let computedSummary = null;
    if (!summary) {
      const totalOrders = await Order.countDocuments();
      const totalRevenueAgg = await Order.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]);
      const totalRevenue = totalRevenueAgg[0]?.total ?? 0;
      const totalProducts = await Product.countDocuments();
      computedSummary = {
        totalOrders,
        totalRevenue,
        totalProducts,
        pendingOrders: await Order.countDocuments({ status: "pending" }),
        completedOrders: await Order.countDocuments({ status: "completed" }),
        cancelledOrders: await Order.countDocuments({ status: "cancelled" }),
        refundedOrders: await Order.countDocuments({ status: "refunded" }),
        shippedOrders: await Order.countDocuments({ status: "shipped" }),
        totalCustomers: 0,
      };
    }

    return NextResponse.json({
      ok: true,
      revenue: { dates: revenueDates, values: revenueValues },
      ordersByStatus,
      topProducts,
      lowStockProducts,
      summary: summary || computedSummary,
    });
  } catch (err: any) {
    console.error("Analytics GET error:", err);
    return NextResponse.json({ error: err.message || "Analytics error" }, { status: 500 });
  }
}
