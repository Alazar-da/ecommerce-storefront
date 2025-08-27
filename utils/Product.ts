export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // store in cents for Stripe compatibility
  currency: "usd" | "eur"; // can extend later
  categoryId: string;
  imageUrl: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}
