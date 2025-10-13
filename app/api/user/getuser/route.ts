import { NextResponse,NextRequest } from "next/server";
import connectDB from "@/DB/connectDB";
import User from "@/models/User";

// ✅ Get user by ID
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const user = await User.findById(id).select('-password'); // exclude password
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Update user by ID
export async function PUT(
 request: NextRequest
) {
  try {
    await connectDB();
    const updateData = await request.json();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Delete user by ID
export async function DELETE(
  request: NextRequest
) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
