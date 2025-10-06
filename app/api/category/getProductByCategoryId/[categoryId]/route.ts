import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/DB/connectDB";
import Product from "@/models/Product";

export async function GET(
  req: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    await connectDB();

    const { categoryId } = params;
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    if (!categoryId || categoryId === "undefined") {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    // ✅ Build query
    const query: any = { categoryId };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Fetch products for this category
    const products = await Product.find(query)
      .populate("categoryId", "name description image")
      .sort({ createdAt: -1 });

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching category products:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch category products" },
      { status: 500 }
    );
  }
}
