import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import User from "@/models/User";

// ✅ Get user by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = await User.findById(params.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Update user
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const data = await req.json();
    const updatedUser = await User.findByIdAndUpdate(params.id, data, { new: true });
    if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Delete user
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deletedUser = await User.findByIdAndDelete(params.id);
    if (!deletedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
