import { Product } from "@/types/Product";

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`/api/product/getproduct?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch product:", await res.text());
      return null;
    }

    const data = await res.json();
    return data as Product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
