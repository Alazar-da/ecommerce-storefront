import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Order from "@/models/Order";

// ✅ Create new order
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const newOrder = await Order.create(data);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Get all orders
export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find()
      .populate("userId") // get user details
      .populate("items.productId"); // get product details
    return NextResponse.json(orders, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
