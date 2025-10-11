import { NextResponse,NextRequest } from "next/server";
import connectDB from "@/DB/connectDB";
import Product from "@/models/Product";

export async function POST(
 request: NextRequest
 ) {
  try {
    await connectDB();
    const { rating } = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Validate rating
    if (typeof rating !== "number" || rating < 0 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 0 and 5" }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Push new rating to the array
    product.rating.push(rating);
    await product.save();

    // Calculate new average
    const avgRating =
      product.rating.reduce((acc, val) => acc + val, 0) / product.rating.length;

    return NextResponse.json(
      { success: true, productId: id, ratings: product.rating, average: avgRating },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
