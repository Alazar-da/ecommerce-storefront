"use client";
import { useEffect, useState } from "react";
import { Product } from "@/types/Product";
import Link from "next/link";
import { FiStar, FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
import { formatPrice } from "@/utils/formatPrice";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/product/featured");
        const data = await res.json();
        setFeatured(data);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

   // Render star ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-500 ml-1">({rating})</span>
      </div>
    );
  };

  const addToCart = (productId: string) => {
    // Add to cart logic here
    console.log('Added to cart:', productId);
  };

  const addToWishlist = (productId: string) => {
    // Add to wishlist logic here
    console.log('Added to wishlist:', productId);
  };

  if (loading) return <p>Loading featured products...</p>;

  return (

    <section id="Products" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
            Featured Collection
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Featured
            <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Products
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products that combine quality, 
            style, and exceptional value.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-4 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-2xl hover:bg-emerald-600 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            View All Products
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Add custom styles for line clamping */}
      <style jsx global>{`
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </section>
  );
};

