import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Cart from "@/models/Cart";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { cartId, productId, quantity } = await req.json();

    const cart = await Cart.findById(cartId);
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    item.quantity = quantity;
    cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    await cart.save();

    return NextResponse.json(cart, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { cartId, productId } = await req.json();

    const cart = await Cart.findById(cartId);
    if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    await cart.save();

    return NextResponse.json(cart, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Create a new cart
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const newCart = await Cart.create(data);
    return NextResponse.json(newCart, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}