// app/api/admin/orders/[id]/refund/route.ts
import { NextResponse,NextRequest } from "next/server";
import connectDB from "@/DB/connectDB";
import Order from "@/models/Order";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2025-09-30.clover" });

/* function requireAdmin(req: Request) {
  // TODO: implement admin auth
  return;
} */

export async function POST(request: NextRequest,
  params: { id: Promise<{ id: string }> } // Type params as a Promise
) {
  try {
    /* requireAdmin(req); */
    await connectDB();
    const order = await Order.findById(await params.id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (!order.paymentIntentId) {
      return NextResponse.json({ error: "No paymentIntentId on order" }, { status: 400 });
    }
    if (order.refunded) {
      return NextResponse.json({ error: "Order already refunded" }, { status: 400 });
    }

    // create refund for the payment_intent
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentIntentId,
      // amount: order.totalAmount, // optional: refund full amount; leave out to refund full
    });

    // mark order refunded
    order.status = "refunded";
    order.refunded = true;
    await order.save();

    return NextResponse.json({ success: true, refund }, { status: 200 });
  } catch (err: any) {
    console.error("Refund error:", err);
    return NextResponse.json({ error: err.message || "Refund failed" }, { status: 500 });
  }
}
