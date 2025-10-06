import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/DB/connectDB";
import Order from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);


// ✅ Create Payment Intent
export async function POST(req: Request) {
  try {
    const { amount, orderId } = await req.json();
    if (!amount || !orderId)
      return NextResponse.json({ error: "Missing amount or orderId" }, { status: 400 });

    await connectDB();

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { orderId },
    });

    // Store the paymentIntentId in the order
    await Order.findByIdAndUpdate(orderId, {
      paymentIntentId: paymentIntent.id,
      status: "pending",
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error("Stripe error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
