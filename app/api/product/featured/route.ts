import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Product from "@/models/Product";

// ✅ GET /api/product/featured
export async function GET() {
  try {
    await connectDB();

    // Fetch products where featured = true
    const featuredProducts = await Product.find({ featured: true })
      .populate("categoryId", "name") // optional: populate category name
      .sort({ createdAt: -1 }); // newest first

    return NextResponse.json(featuredProducts, { status: 200 });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 }
    );
  }
}
