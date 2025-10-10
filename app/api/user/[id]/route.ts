import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import User from "@/models/User";

// ✅ Get user by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const user = await User.findById(params.id).select('-password'); // exclude password
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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const updateData = await req.json();

    const updatedUser = await User.findByIdAndUpdate(params.id, updateData, {
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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const deletedUser = await User.findByIdAndDelete(params.id);

    if (!deletedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
