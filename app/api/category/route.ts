import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Category from "@/models/Category";

// ✅ Create new category
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const newCategory = await Category.create(data);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Get all categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find();
    return NextResponse.json(categories, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
