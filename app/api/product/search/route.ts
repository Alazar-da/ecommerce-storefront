import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Product from "@/models/Product";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.trim() === "") {
      return NextResponse.json([], { status: 200 });
    }

    const products = await Product.find({
      name: { $regex: q, $options: "i" },
    })
      .select("name price image categoryId")
      .limit(8)
      .populate("categoryId", "name");

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to search products" },
      { status: 500 }
    );
  }
}
