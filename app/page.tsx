'use client';
import { useState } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiMenu, FiX, FiStar, FiArrowRight } from 'react-icons/fi';

// Types for our products
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  category: string;
  featured?: boolean;
}

// Mock data for our store
const products: Product[] = [
  { id: 1, name: 'Wireless Headphones', price: 199.99, originalPrice: 249.99, image: '/api/placeholder/300/300', rating: 4.5, category: 'Electronics', featured: true },
  { id: 2, name: 'Running Shoes', price: 89.99, image: '/api/placeholder/300/300', rating: 4.2, category: 'Footwear', featured: true },
  { id: 3, name: 'Cotton T-Shirt', price: 24.99, image: '/api/placeholder/300/300', rating: 4.0, category: 'Clothing', featured: true },
  { id: 4, name: 'Smart Watch', price: 249.99, image: '/api/placeholder/300/300', rating: 4.7, category: 'Electronics', featured: true },
  { id: 5, name: 'Coffee Maker', price: 79.99, image: '/api/placeholder/300/300', rating: 4.3, category: 'Appliances' },
  { id: 6, name: 'Backpack', price: 59.99, image: '/api/placeholder/300/300', rating: 4.1, category: 'Accessories' },
  { id: 7, name: 'Desk Lamp', price: 34.99, image: '/api/placeholder/300/300', rating: 4.4, category: 'Home' },
  { id: 8, name: 'Water Bottle', price: 19.99, image: '/api/placeholder/300/300', rating: 4.6, category: 'Accessories' },
];

const categories = [
  { id: 1, name: 'Electronics', image: '/api/placeholder/200/200', count: 12 },
  { id: 2, name: 'Clothing', image: '/api/placeholder/200/200', count: 8 },
  { id: 3, name: 'Home & Kitchen', image: '/api/placeholder/200/200', count: 15 },
  { id: 4, name: 'Footwear', image: '/api/placeholder/200/200', count: 6 },
];

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">ShopNow</a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-800 hover:text-blue-600 font-medium">Home</a>
            <a href="/products" className="text-gray-800 hover:text-blue-600 font-medium">Products</a>
            <a href="#" className="text-gray-800 hover:text-blue-600 font-medium">Categories</a>
            <a href="#" className="text-gray-800 hover:text-blue-600 font-medium">Deals</a>
            <a href="#" className="text-gray-800 hover:text-blue-600 font-medium">About</a>
          </nav>

          {/* Search, Cart, and User Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <FiSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none w-40 lg:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button className="p-2 text-gray-700 hover:text-blue-600 relative">
              <FiHeart className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
            </button>

            <button className="p-2 text-gray-700 hover:text-blue-600 relative">
              <FiShoppingCart className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
            </button>

            <button className="p-2 text-gray-700 hover:text-blue-600">
              <FiUser className="text-xl" />
            </button>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              className="bg-transparent outline-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3">
            <a href="/" className="block text-gray-800 hover:text-blue-600 font-medium py-2">Home</a>
            <a href="/products" className="block text-gray-800 hover:text-blue-600 font-medium py-2">Products</a>
            <a href="#" className="block text-gray-800 hover:text-blue-600 font-medium py-2">Categories</a>
            <a href="#" className="block text-gray-800 hover:text-blue-600 font-medium py-2">Deals</a>
            <a href="#" className="block text-gray-800 hover:text-blue-600 font-medium py-2">About</a>
          </nav>
        )}
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ShopNow</h3>
            <p className="text-gray-400 mb-4">Your one-stop shop for all your needs. Quality products at affordable prices.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">...</svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">...</svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">...</svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">All Products</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">New Arrivals</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Discounts</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Best Sellers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 w-full rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2023 ShopNow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
          <FiHeart className="text-gray-600" />
        </button>
        {product.originalPrice && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Save ${(product.originalPrice - product.price).toFixed(2)}
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FiStar 
                key={i} 
                className={i < Math.floor(product.rating) ? "fill-current" : ""} 
              />
            ))}
          </div>
          <span className="text-gray-600 text-sm ml-1">({product.rating})</span>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div>
            {product.originalPrice ? (
              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <button className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Summer Sale Up To 50% Off</h1>
              <p className="text-xl mb-8">Discover the latest trends and get amazing deals on our premium products.</p>
              <div className="flex space-x-4">
                <a href="/products" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Shop Now
                </a>
                <a href="#" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map(category => (
                <a 
                  key={category.id} 
                  href={`/products?category=${category.name}`}
                  className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="bg-gray-200 rounded-full h-24 w-24 mx-auto mb-4 overflow-hidden">
                    <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                  </div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.count} items</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <a href="/products" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                View All <FiArrowRight className="ml-1" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.filter(p => p.featured).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-12 bg-gray-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Stay updated with our latest products, exclusive offers, and discounts.</p>
            <form className="max-w-md mx-auto flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <button 
                type="submit" 
                className="bg-blue-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;