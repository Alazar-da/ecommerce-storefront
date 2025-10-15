// app/api/admin/orders/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Order from "@/models/Order";

export async function GET(req: Request) {
  try {
    /*     requireAdmin(req); */

    await connectDB();
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "";
    const status = url.searchParams.get("status") || "";
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 20);
    const skip = (page - 1) * limit;

    const query: any = {};
    if (status) query.status = status;
    if (q) {
      // search by order id, user id or product name
      query.$or = [
        { _id: q },
        { userId: q },
        { "items.name": { $regex: q, $options: "i" } },
      ];
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "userId",
          model: "User",
        })
        .populate({
          path: "items.productId",
          model: "Product",
        })
        .lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({ orders, total, page, limit }, { status: 200 });
  } catch (err: any) {
    console.error("Admin orders list error:", err);
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
