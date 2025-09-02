import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Cart from "@/models/Cart";

// ✅ Get cart by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const cart = await Cart.findById(params.id).populate("user").populate("items.category");
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    return NextResponse.json(cart, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Update cart
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const data = await req.json();
    const updatedCart = await Cart.findByIdAndUpdate(params.id, data, { new: true });
    if (!updatedCart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Delete cart
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deletedCart = await Cart.findByIdAndDelete(params.id);
    if (!deletedCart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    return NextResponse.json({ message: "Cart deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
