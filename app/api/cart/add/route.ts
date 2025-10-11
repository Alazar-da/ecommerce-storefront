// /pages/api/cart/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Cart from "@/models/Cart";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, product, quantity } = await req.json();

    if (!userId || !product || !product._id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Validate product exists in DB
    const dbProduct = await Product.findById(product._id);
    if (!dbProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Find user cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create new cart if not exists
      cart = new Cart({
        user: userId,
        items: [],
        totalQuantity: 0,
        total: 0,
      });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === product._id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity,
        category: product.categoryId,
      });
    }

    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    await cart.save();

    return NextResponse.json(cart, { status: 200 });
  } catch (error: any) {
    console.error("Add to cart error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
