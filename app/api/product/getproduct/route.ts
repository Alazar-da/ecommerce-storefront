import { NextResponse,NextRequest } from "next/server";
import connectDB from "@/DB/connectDB";
import Product from "@/models/Product";

// ✅ Get single product by ID
export async function GET(
 request: NextRequest
 ) {
  try {
    await connectDB();
            const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const product = await Product.findById(id).populate("categoryId");
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Update product by ID
export async function PUT(
 request: NextRequest
) {
  try {
    await connectDB();
    const data = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Delete product by ID
export async function DELETE(
  request: NextRequest
) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
