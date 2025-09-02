import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import OrderSummary from "@/models/OrderSummary";

// ✅ Create new order summary record
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const newSummary = await OrderSummary.create(data);
    return NextResponse.json(newSummary, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Get all order summaries
export async function GET() {
  try {
    await connectDB();
    const summaries = await OrderSummary.find();
    return NextResponse.json(summaries, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
