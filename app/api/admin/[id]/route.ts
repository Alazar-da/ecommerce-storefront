import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Order from "@/models/Order";
import type { NextRequest } from "next/server";

export async function GET(
 request: NextRequest,
) {
  try {
    await connectDB();
        const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const order = await Order.findById(id).lean();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order, { status: 200 });
  } catch (err: unknown) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


export async function PUT( request: NextRequest,
) {
  try {
    await connectDB();
    const body = await request.json();
        const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    // allowed updates: status, shipping, tracking, payment info
    const updatePayload: any = {};
    if (body.status) updatePayload.status = body.status;
    if (body.shipping) updatePayload.shipping = body.shipping;
    if (typeof body.refunded === "boolean") updatePayload.refunded = body.refunded;
    if (body.paymentMethod) updatePayload.paymentMethod = body.paymentMethod;

    const order = await Order.findByIdAndUpdate(id, updatePayload, { new: true }).lean();
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE( request: NextRequest
) {
  try {
    await connectDB();
        const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
