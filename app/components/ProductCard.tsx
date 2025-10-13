'use client';
import {Product} from '@/types/Product';
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/utils/formatPrice';
import { useState } from 'react';
import {Cart} from '@/types/Cart';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user }: { user: any } = useAuthStore();
      const route = useRouter();
      console.log('User in ProductCard:', user);
      const [cart, setCart] = useState<Cart | null>(null);


      console.log('Product in ProductCard:', product);
const handleAddToCart = async (product: Product) => {
  if (!user) {
    toast.info('Please log in to add items to cart');
    return;
  }

  try {
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user?.id,
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          categoryId: (product.categoryId as any)._id || product.categoryId,
        },
        quantity: 1
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add to cart');
    }

    const updatedCart = await response.json();
    setCart(updatedCart);
    toast.success(`${product.name} added to cart!`);
   window.location.reload()
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    toast.error('Failed to add item to cart');
  }
};

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 fill-current'
        }`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };
    const handleProductView = (product: Product) => {
      if (user) {
        route.push(`/products/viewproduct?id=${product._id}`);
      } else {
        toast.info('Please log in to view this product');
      }
    }

  return (
    <section onClick={() => handleProductView(product)}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <div className="absolute top-2 left-2">
              <span className="bg-emerald-500 text-white px-2 py-1 text-xs font-semibold rounded-full">
                Featured
              </span>
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
              <span className="bg-gray-600 text-white px-3 py-1 text-sm font-semibold rounded">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category Badge */}
          <div className="mb-2">
            <span className="bg-cyan-100 text-cyan-800 text-xs font-medium px-2 py-1 rounded">
              {product.categoryId?.name || 'Category'}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
               {renderStars(product?.averageRating ?? 0)}
            </div>
            <span className="text-gray-500 text-sm ml-2">
              {(product?.averageRating !== undefined ? product.averageRating.toFixed(1) : '0.0')}
            </span>
          </div>

          {/* Price and Stock */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-emerald-600">
                {formatPrice(product.price, product.currency)}
              </span>
            </div>
            <div className="text-right">
              <span
                className={`text-sm font-medium ${
                  product.stock > 10
                    ? 'text-emerald-600'
                    : product.stock > 0
                    ? 'text-amber-600'
                    : 'text-red-600'
                }`}
              >
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product);
            }}
            className={`w-full mt-3 py-2 px-4 rounded-lg font-semibold transition-colors duration-200 hover:cursor-pointer ${
              product.stock > 0
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductCard;