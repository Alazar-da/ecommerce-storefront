import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Cart from "@/models/Cart"; // Make sure you have a Cart model
import { useSession } from "next-auth/react";

export async function GET(  req: Request,
  { params }: { params: { id: string } }) {
  try {
    await connectDB();

       const { id } = params;

    const cart = await Cart.findOne({ user: id });
    const itemCount = cart ? cart.items.reduce((total: number, item: any) => total + item.quantity, 0) : 0;

    return NextResponse.json({ count: itemCount }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
