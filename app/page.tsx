import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import CategorySection from './components/CategorySection';

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

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col text-slate-800">
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
        {/* <section className="py-12 bg-gray-50">
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
        </section> */}
        <CategorySection />

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