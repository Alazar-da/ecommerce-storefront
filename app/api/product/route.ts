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

// ✅ Get products with search, filter, pagination
export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const q = url.searchParams.get("q") || ""; // general search term
    const categoryId = url.searchParams.get("categoryId") || "";
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 10);
    const skip = (page - 1) * limit;

    // Build query object
    const query: any = {};
    if (categoryId && categoryId !== "all") query.categoryId = categoryId;
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    // Fetch products and total count in parallel
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("categoryId")
        .lean(),
      Product.countDocuments(query),
    ]);

    // Respond with pagination info
    return NextResponse.json(
      {
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Products list error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}




// ✅ Update product
export async function PUT(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const { ...updateData } = await req.json();

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
