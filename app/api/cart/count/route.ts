import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Cart from "@/models/Cart"; // Make sure you have a Cart model

export async function GET(  req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const cart = await Cart.findOne({ user: id });
    const itemCount = cart ? cart.items.reduce((total: number, item: any) => total + item.quantity, 0) : 0;

    return NextResponse.json({ count: itemCount }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
