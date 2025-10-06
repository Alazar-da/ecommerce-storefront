import mongoose, { Schema, Document, Model } from "mongoose";
import { ICategory } from "./Category";

// Define Product interface
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number; // stored in cents (Stripe-friendly)
  currency: "ETB" | "USD";
  categoryId: ICategory["_id"];
  imageUrl: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // cents
    currency: {
      type: String,
      enum: ["ETB", "USD"],
      default: "ETB",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // reference Category model
      required: true,
    },
    imageUrl: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
  },
  { timestamps: true } // auto adds createdAt & updatedAt
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
