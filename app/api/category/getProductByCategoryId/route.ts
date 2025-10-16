import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/DB/connectDB";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("id");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sort");

    // ✅ Build query dynamically
    const query: any = {};

    if (categoryId && categoryId !== "undefined" && categoryId.trim() !== "") {
      query.categoryId = categoryId;
    }

    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Determine sort order
    let sortOption: any = { createdAt: -1 };
    switch (sortBy) {
      case "name":
        sortOption = { name: 1 };
        break;
      case "price-low":
        sortOption = { price: 1 };
        break;
      case "price-high":
        sortOption = { price: -1 };
        break;
      case "newest":
        sortOption = { createdAt: -1 };
        break;
      default:
        break;
    }

    const products = await Product.find(query)
      .populate("categoryId", "name description image")
      .sort(sortOption);

    // ✅ if a specific category ID was provided but no products found
    if (categoryId && products.length === 0) {
      return NextResponse.json(
        { message: "No products found for this category", products: [] },
        { status: 404 }
      );
    }

    return NextResponse.json({ products }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
