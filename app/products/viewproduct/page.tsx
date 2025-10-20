"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ViewProduct from "../../components/ViewProduct";
import { fetchProductById } from "@/utils/fetchProductById";
import { Product } from "@/types/Product";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

function ProductPageContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { user }: { user: any } = useAuthStore();

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


 if (!user)
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view product details.</p>
          <Link
            href="/login"
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Log In
          </Link>
        </div>
      );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 animate-pulse">Loading Product Details...</p>
    </div>
  )
  ;

  if (!product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="p-6 text-center text-red-500">Product not found.</p>
               <Link
          href="/"
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
        >Home</Link>
      </div>
    );

  return <ViewProduct product={product} />;
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading product details...</div>}>
      <ProductPageContent />
    </Suspense>
  );
}
