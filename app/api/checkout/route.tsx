// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency = "usd", orderId } = await req.json();

    if (!amount || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ✅ Create a PaymentIntent on the server
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { orderId },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error("Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
