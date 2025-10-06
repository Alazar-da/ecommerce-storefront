import mongoose, { Schema, Document, Model } from "mongoose";
import {IUser } from "./User"; // reference user
import { ICategory } from "./Category"; // example: product categories

// Cart item interface
interface ICartItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  category?: ICategory["_id"]; // optional relation
}

// Cart main interface
export interface ICart extends Document {
  user: IUser["_id"]; // ref to User
  items: ICartItem[];
  total: number;
  createdAt: Date;
}

const CartSchema: Schema<ICart> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // relation to User collection
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);

export default Cart;
