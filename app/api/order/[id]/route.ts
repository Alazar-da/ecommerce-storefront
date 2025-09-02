import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Order from "@/models/Order";

// ✅ Get order by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const order = await Order.findById(params.id).populate("userId").populate("items.productId");
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Update order
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const data = await req.json();
    const updatedOrder = await Order.findByIdAndUpdate(params.id, data, { new: true });
    if (!updatedOrder) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Delete order
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deletedOrder = await Order.findByIdAndDelete(params.id);
    if (!deletedOrder) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ message: "Order deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
