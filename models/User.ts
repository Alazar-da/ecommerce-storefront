import mongoose, { Schema, Document, Model } from "mongoose";

// Define TypeScript interface for User model
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
  createdAt: Date;
}

// Create User Schema
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // prevent duplicate emails
      lowercase: true, // automatically converts to lowercase
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["customer", "admin"], // restrict to specific values
      default: "customer",
    },
  },
  { timestamps: true } // auto add createdAt & updatedAt
);

// Prevent model overwrite on hot reload in Next.js
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
