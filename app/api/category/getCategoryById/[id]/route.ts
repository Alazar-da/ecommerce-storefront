import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import Category from "@/models/Category";

// ✅ Get category by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    
    // Validate ID
    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const category = await Category.findById(id);
    
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error: any) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return NextResponse.json({ error: "Invalid category ID format" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Update category by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;
    const data = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error: any) {
    if (error.name === 'CastError') {
      return NextResponse.json({ error: "Invalid category ID format" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Delete category by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Category deleted successfully" }, 
      { status: 200 }
    );
  } catch (error: any) {
    if (error.name === 'CastError') {
      return NextResponse.json({ error: "Invalid category ID format" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}