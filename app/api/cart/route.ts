import { NextResponse,NextRequest } from "next/server";
import connectDB from "@/DB/connectDB";
import Cart from "@/models/Cart";

export async function GET(
request: NextRequest,
) {
  try {
    await connectDB();
     const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const cart = await Cart.findOne({ user: id })
      .populate({
        path: "items.productId",
        select: "name price imageUrl stock rating averageRating", // fields you want
      });

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
 request: NextRequest,
) {
  try {
    await connectDB();
 const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const { items, totalQuantity, totalPrice } = await request.json();

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
 request: NextRequest
) {
  try {
    await connectDB();
     const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

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