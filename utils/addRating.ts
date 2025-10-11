export async function addRatingToProduct(productId: string, rating: number) {
  try {
    const res = await fetch(`/api/product/rating?id=${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to add rating");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Failed to add rating:", error);
    return null;
  }
}
