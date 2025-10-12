import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Use a secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

// POST /api/auth -> login
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    // 🔑 Create JWT token
    const token = jwt.sign(
      { id: user._id, name: user.username, email: user.email, role: user.role },
      JWT_SECRET
    );

    return NextResponse.json({
      success: true,
      user: { id: user._id, email: user.email, name: user.username, role: user.role },
      token,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// GET /api/auth -> check session
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No token");

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    return NextResponse.json({ user: { id: decoded.id, name: decoded.name, email: decoded.email, role: decoded.role } });
  } catch (err) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
