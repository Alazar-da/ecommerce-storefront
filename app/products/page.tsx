'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types/Product';
import { Category } from '@/types/Category';
import { Cart } from '@/types/Cart';
import { CartItem } from '@/types/CartItem';
import { useSession, signOut } from "next-auth/react";
import { toast } from 'react-toastify';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('name');
  const [searchQuery, setSearchQuery] = useState<string>('');
    const [cart, setCart] = useState<Cart | null>(null);
     const { data: session, status } = useSession();
       const user = session?.user;


  
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');

  useEffect(() => {
    if (categoryId) {
      fetchProducts(categoryId);
      console.log("Fetching products for category ID:", categoryId);
    } else {
      setError('No category specified');
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, sortBy, searchQuery]);

const fetchProducts = async (id: string) => {
  try {
    setLoading(true);
    setError(null);

    const response = await fetch(`/api/category/getProductByCategoryId/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const productsData = await response.json();
    setProducts(productsData);
  } catch (err: any) {
    setError(err.message);
    console.error("Error fetching products:", err);
    toast.error("Failed to load products");
  } finally {
    setLoading(false);
  }
};

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled in the filterAndSortProducts useEffect
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default:
        break;
    }
    
    setFilteredProducts(filtered);
  };




  // Get category name from first product (since all products belong to same category)
  const categoryName = products.length > 0 && products[0].categoryId 
    ? (products[0].categoryId as Category).name 
    : 'Products';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4">
                  <div className="bg-gray-300 h-48 rounded-md mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Products</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => categoryId && fetchProducts(categoryId)}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-8 text-slate-800">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Categories
              </Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-2">/</span>
              <span className="text-gray-900 font-medium capitalize">
                {categoryName}
              </span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 capitalize mb-2">
              {categoryName}
            </h1>
            <p className="text-gray-600">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {/* Search and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48"
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 rounded-r-md hover:bg-emerald-700 transition-colors text-sm"
              >
                Search
              </button>
            </form>
            
            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              {searchQuery ? '🔍' : '😔'}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {searchQuery ? 'No Products Found' : 'No Products Available'}
            </h2>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `No products found for "${searchQuery}" in this category.`
                : 'There are no products available in this category at the moment.'
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors mr-4"
              >
                Clear Search
              </button>
            )}
            <Link
              href="/"
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Back to Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductsPage;