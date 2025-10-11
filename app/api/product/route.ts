import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Product from "@/models/Product";

// ✅ Create new product
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const newProduct = await Product.create(data);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    console.log("Error in POST /api/product:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });

  }
}

// ✅ Get all products with optional filters
export async function GET(req: Request) {
  try {
    await connectDB();

    // Extract query params (categoryId & search)
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("id");
    const search = searchParams.get("search");

    // Build query object
    const query: any = {};
     // ✅ Only filter by category if it's not "all" and not empty
    if (categoryId && categoryId !== "all") {
      query.categoryId = categoryId;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } }, // case-insensitive
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Fetch products
    const products = await Product.find(query).populate("categoryId");

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// ✅ Update product
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { id, ...updateData } = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Delete product
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
