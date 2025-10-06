import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, items, status } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    // ✅ Calculate totalAmount securely on backend
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity;
    }, 0);

    const newOrder = await Order.create({
      userId,
      items,
      totalAmount,
      status: status || "pending",
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

// ✅ Get all orders
export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find()
      .populate({
        path: "userId"
      })
      .populate({
        path: "items.productId"
      })
      .sort({ createdAt: -1 }); // newest first

    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    console.error("❌ Failed to fetch orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}


// ✅ Update order
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { id, ...updateData } = await req.json();

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Delete order
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    await Order.findByIdAndDelete(id);
    return NextResponse.json({ message: "Order deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
