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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Get all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().populate("categoryId");
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
