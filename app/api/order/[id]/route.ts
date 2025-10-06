import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Order from "@/models/Order";

// ✅ Get order by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const order = await Order.findById(params.id)
      .populate("userId")
      .populate("items.productId", "name price image"); // populate only needed fields

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 🔹 Transform productId → product for frontend
    const formattedOrder = {
      ...order.toObject(),
      items: order.items.map((item: any) => ({
        _id: item._id,
        quantity: item.quantity,
        product: {
          _id: item.productId?._id,
          name: item.productId?.name,
          price: item.productId?.price,
          image: item.productId?.image,
        },
      })),
    };

    return NextResponse.json(formattedOrder, { status: 200 });
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
    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
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
    if (!deletedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Order deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
