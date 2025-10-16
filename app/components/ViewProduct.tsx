// components/ViewProduct.tsx
'use client';
import { useState } from 'react';
import { Product } from '@/types/Product';
import {formatPrice} from '@/utils/formatPrice';
import RatingPopup from './RatingPopup';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import {Cart} from '@/types/Cart';
import { useAuthStore } from '@/store/useAuthStore';
import { shortDate } from '@/utils/date';


interface ViewProductProps {
  product: Product;
}

const ViewProduct: React.FC<ViewProductProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
    const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [avg, setAvg] = useState<number | null>(null);
       const { user }: { user: any } = useAuthStore();
        const route = useRouter();
        const [cart, setCart] = useState<Cart | null>(null);


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`w-6 h-6 ${
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
          quantity: quantity
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

  const handleQuantityChange = (value: number) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen text-slate-800">
       <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
                <Link href={`/products?category=${product?.categoryId._id}`} className="text-gray-500 hover:text-gray-700">
                 {product?.categoryId.name}
                </Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-900 font-medium capitalize">
                {product?.name}
              </span>
            </li>
          </ol>
        </nav>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={product?.imageUrl}
              alt={product?.name}
              className="w-full h-96 object-fill"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Category and Featured Badge */}
          <div className="flex items-center space-x-2">
            <span className="bg-cyan-100 text-cyan-800 text-sm font-medium px-3 py-1 rounded-full">
              {product?.categoryId.name || 'Category'}
            </span>
            {product?.featured && (
              <span className="bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>

          {/* Product Name */}
          <h1 className="text-3xl font-bold text-gray-900">{product?.name}</h1>

          {/* Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(product?.averageRating ?? 0)}
            </div>
            <span className="text-gray-600 text-lg">
              {(product?.averageRating !== undefined ? product.averageRating.toFixed(1) : '0.0')} out of 5
            </span>
            <span className="text-cyan-600 text-lg">•</span>
            <span className="text-gray-600 text-lg">
              {product?.stock} in stock
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-emerald-600">
              {formatPrice(product?.price, product?.currency)}
            </span>
          </div>

          {/* Description */}
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </h3>
            <p className="text-gray-700 leading-relaxed">{product?.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="px-4 py-2 text-gray-600 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
              >
                -
              </button>
              <span className="px-4 py-2 text-lg font-semibold">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product?.stock}
                className="px-4 py-2 text-gray-600 hover:text-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="flex space-x-4">
            <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product);
            }}
              className={`flex-1 py-4 px-6 rounded-lg font-semibold text-lg transition-colors duration-200  hover:cursor-pointer ${
                product?.stock > 0
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={product?.stock === 0}
            >
              {product?.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
             <button
          onClick={() => setIsRatingOpen(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-md transition hover:cursor-pointer"
        >
          ⭐ Rate Product
        </button>
          </div>

          {/* Product Details */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-600">SKU:</span>
                <span className="ml-2 text-gray-900">#{product?._id.toString().slice(-8)}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Category:</span>
                <span className="ml-2 text-gray-900">
                  {product?.categoryId?.name || 'N/A'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Availability:</span>
                <span
                  className={`ml-2 font-medium ${
                    product?.stock > 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {product?.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Created:</span>
                <span className="ml-2 text-gray-900">
                  {shortDate(product?.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

       <RatingPopup
        productId={product._id}
        isOpen={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        onRated={(average) => setAvg(average)}
      />
    </section>
  );
};

export default ViewProduct;