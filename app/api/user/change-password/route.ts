import { NextResponse } from "next/server";
import connectDB from "@/DB/connectDB";
import User from "@/models/User";
import bcrypt from "bcryptjs";

interface RequestBody {
  userId: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, currentPassword, newPassword, confirmPassword }: RequestBody = await req.json();

    // Validate new passwords
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ success: false, message: "New passwords do not match" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Current password is incorrect" }, { status: 401 });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return NextResponse.json({ success: true, message: "Password updated successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
