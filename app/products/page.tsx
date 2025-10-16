'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/Product';
import { Category } from '@/types/Category';
import { toast } from 'react-toastify';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';

function ProductsPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('name');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const router = useRouter();



  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/category/getCategories');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);
// ✅ Fetch products whenever categoryId, sort, or search changes
useEffect(() => {
  const savedCategory = localStorage.getItem('selectedCategory');
  const parsed = savedCategory ? JSON.parse(savedCategory) : null;

  // Use saved category if exists, otherwise use current categoryId
  const activeCategoryId = parsed?._id || categoryId;

  // If "All Categories" is selected (empty string), fetch all products
  fetchProducts(activeCategoryId || '', sortBy, searchQuery);
  setCategoryId(activeCategoryId || '');
}, [categoryId, sortBy, searchQuery]);


// ✅ Fetch products API call
const fetchProducts = async (id: string, sort: string, search: string) => {
  try {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();

    // ✅ only append id if it's NOT empty
    if (id && id.trim() !== '') params.append('id', id);
    if (sort) params.append('sort', sort);
    if (search) params.append('search', search);

    const query = params.toString() ? `?${params.toString()}` : '';
    console.log('Fetching products with params:', query);

    const response = await fetch(`/api/category/getProductByCategoryId${query}`, {
      cache: 'no-store',
    });
    const data = await response.json();

    // ✅ If no products and a specific category was chosen, show info
    if (response.status === 404 || (Array.isArray(data.products) && data.products.length === 0)) {
      setProducts([]);
      if (id) toast.info('No products found for this category.');
      return;
    }

    // ✅ Otherwise, show products
    setProducts(data.products || data);
  } catch (err: any) {
    console.error('Error fetching products:', err);
    setError(err.message);
    toast.error('Failed to load products');
  } finally {
    setLoading(false);
  }
};


  // ✅ Filter + sort frontend fallback
  useEffect(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    setFilteredProducts(filtered);
  }, [products, sortBy, searchQuery]);

  // ✅ When category changes — update state + localStorage + URL
const handleCategoryChange = (value: string) => {
  setCategoryId(value);

  if (value) {
    const selected = categories.find((cat) => cat._id === value);
    if (selected) localStorage.setItem('selectedCategory', JSON.stringify(selected));
  } else {
    // ✅ Clear saved category when "All Categories" selected
    localStorage.removeItem('selectedCategory');
  }

  const params = new URLSearchParams();
  if (value) params.set('id', value);
  if (sortBy) params.set('sort', sortBy);
  if (searchQuery) params.set('search', searchQuery);
  router.push(`/products?${params.toString()}`);
};


  const handleSearch = (e: React.FormEvent) => e.preventDefault();

  const categoryName =
    categories.find((c) => c._id === categoryId)?.name || 'All Products';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center">
        <div className="text-gray-500 text-lg animate-pulse">
          Loading products...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Error Loading Products
        </h1>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => fetchProducts(categoryId, sortBy, searchQuery)}
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Retry
        </button>
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize mb-2">
              {categoryId ? categoryName : 'All Products'}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? 's' : ''} found
              {searchQuery && (
                <span className="text-emerald-600 ml-2">
                  for "{searchQuery}"
                </span>
              )}
              {categoryId && categoryName && (
                <span className="text-emerald-600 ml-2">in {categoryName}</span>
              )}
            </p>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:min-w-[280px]">
              <input
                type="text"
                placeholder="Search products by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="relative flex-1 min-w-[160px]">
              <select
                name="categoryId"
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white appearance-none transition-colors"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="relative flex-1 min-w-[160px]">
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm bg-white appearance-none transition-colors"
              >
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Products Found
            </h2>
            <Link
              href="/"
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Back to Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-gray-500">Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
