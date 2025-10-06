import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// ✅ Create new user (Register)
export async function POST(req: Request) {
  try {
    await connectDB();
    const { username, email, phone, password, role } = await req.json();

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      phone,
      password: hashedPassword,
      role: "customer",
    });

    return NextResponse.json(
      { message: "User registered successfully", user: { id: newUser._id, email: newUser.email } },
      { status: 201 }
    );
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
