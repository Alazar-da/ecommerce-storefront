import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Cart from "@/models/Cart";

// ✅ Create a new cart
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const newCart = await Cart.create(data);
    return NextResponse.json(newCart, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Get all carts
export async function GET() {
  try {
    await connectDB();
    const carts = await Cart.find().populate("user").populate("items.category");
    return NextResponse.json(carts, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Update cart
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { id, ...updateData } = await req.json();

    const updatedCart = await Cart.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return NextResponse.json(updatedCart, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Delete cart
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    await Cart.findByIdAndDelete(id);
    return NextResponse.json({ message: "Cart deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
