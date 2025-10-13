"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ViewProduct from "../../components/ViewProduct";
import { fetchProductById } from "@/utils/fetchProductById";
import { Product } from "@/types/Product";



const ProductPage: React.FC = () => {
  const [product, setProduct] = useState<Product>();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id") ?? undefined;

  console.log("Product ID from searchParams:", productId);

  useEffect(() => {
    if (!productId) return;

    const loadProduct = async () => {
      const data = await fetchProductById(productId);
      if (data) setProduct(data);
    };

    loadProduct();
  }, [productId]);

  return product ? <ViewProduct product={product} /> : null;
};

export default ProductPage;
