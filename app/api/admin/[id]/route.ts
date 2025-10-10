import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Order from "@/models/Order";
import type { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = context.params;
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


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    // allowed updates: status, shipping, tracking, payment info
    const updatePayload: any = {};
    if (body.status) updatePayload.status = body.status;
    if (body.shipping) updatePayload.shipping = body.shipping;
    if (typeof body.refunded === "boolean") updatePayload.refunded = body.refunded;
    if (body.paymentMethod) updatePayload.paymentMethod = body.paymentMethod;

    const order = await Order.findByIdAndUpdate(params.id, updatePayload, { new: true }).lean();
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await Order.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
