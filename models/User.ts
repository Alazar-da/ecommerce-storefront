import mongoose, { Schema, model,Document, models } from "mongoose";

export interface IUser extends Document {

  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: "admin" | "customer";
  createdAt: Date;
}

// ✅ Define User schema
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite when hot reloading
const User = models.User || model("User", UserSchema);
export default User;
