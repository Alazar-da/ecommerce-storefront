import {Category} from "./Category";
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number; // store in cents for Stripe compatibility
  currency: "ETB" | "USD"; // can extend later
  categoryId: Category;
  imageUrl: string;
  stock: number;
  rating: number[]; // average rating
  averageRating?: number; // Virtual field
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
