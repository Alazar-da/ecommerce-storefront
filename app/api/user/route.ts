import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import User from "@/models/User";

// ✅ Create new user (Register)
export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const newUser = await User.create(data);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Get all users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Update user
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { id, ...updateData } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ Delete user
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
