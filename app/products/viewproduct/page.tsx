"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ViewProduct from "../../components/ViewProduct";
import { fetchProductById } from "@/utils/fetchProductById";
import { Product } from "@/types/Product";

const ProductPage: React.FC = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      try {
        const data = await fetchProductById(productId);
        if (data) setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (!product)
    return <div className="p-6 text-center text-red-500">Product not found.</div>;

  return (
    <Suspense fallback={<div>Loading product details...</div>}>
      <ViewProduct product={product} />
    </Suspense>
  );
};

export default ProductPage;
