import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Cart from "@/models/Cart";

// ✅ GET Cart by userId
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const cart = await Cart.findOne({ user: id });
    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ Update Cart by userId
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
 
const { items, totalQuantity, totalPrice } = await req.json();

const cart = await Cart.findOneAndUpdate(
  { user: id }, // match by user if that's your schema
  { items, totalQuantity, total: totalPrice }, // ✅ map totalPrice → total
  { new: true, upsert: true }
);


    return NextResponse.json(cart, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// ✅ Delete Cart
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const deletedCart = await Cart.findOneAndDelete({ userId: id });
    if (!deletedCart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Cart deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
