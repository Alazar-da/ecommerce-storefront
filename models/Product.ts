import mongoose, { Schema, Document, Model } from "mongoose";
import { ICategory } from "./Category";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number; // stored in cents (Stripe-friendly)
  currency: "ETB" | "USD";
  categoryId: ICategory["_id"];
  imageUrl: string;
  stock: number;
  rating: number[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  averageRating?: number; // Virtual field
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters long"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    currency: {
      type: String,
      enum: ["ETB", "USD"],
      default: "ETB",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
    },
     // 👇 Add this
    rating: {
      type: [Number], // or [{ userId, value }] if storing more detail
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // allow virtual fields in JSON response
    toObject: { virtuals: true },
  }
);

/**
 * ✅ Virtual field to calculate average rating
 */
ProductSchema.virtual("averageRating").get(function (this: IProduct) {
  if (!this.rating || this.rating.length === 0) return 0;
  const total = this.rating.reduce((acc, num) => acc + num, 0);
  return Math.round((total / this.rating.length) * 10) / 10; // rounded to 1 decimal
});

/**
 * ✅ Optional pre-save hook to ensure valid data
 */
ProductSchema.pre<IProduct>("save", function (next) {
  if (this.rating.some((num) => num < 0 || num > 5)) {
    return next(new Error("Invalid rating value"));
  }
  next();
});

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
