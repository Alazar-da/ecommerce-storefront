import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Cart from "@/models/Cart";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { cartId } = await req.json();

    const cart = await Cart.findById(cartId);
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    cart.items = [];
    cart.total = 0;
    await cart.save();

    return NextResponse.json(cart, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
