import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();

    // Only select `_id` and `name`
    const categories = await Category.find({}, { _id: 1, name: 1 }).lean();

    return NextResponse.json(categories, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
