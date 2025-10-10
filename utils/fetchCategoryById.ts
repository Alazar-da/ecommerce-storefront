export interface CategoryType {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fetch a category by ID from the API
 * @param id - The ID of the category
 * @returns Category data or null if not found
 */
export async function fetchCategoryById(id: string): Promise<CategoryType | null> {
  try {
    if (!id) throw new Error("Category ID is required");

    const res = await fetch(`/api/category/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // ✅ Always fetch fresh data
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Failed to fetch category:", errorData.error);
      return null;
    }

    const data: CategoryType = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}
