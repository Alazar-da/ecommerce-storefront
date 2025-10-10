import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';
import CategorySection from './components/CategorySection';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import FeaturedProducts from './components/FeaturedSection';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col text-slate-800">
      <Header />
      
      <main className="flex-grow">

        {/* Hero Section */}
        
        <HeroSection />
        <AboutSection />

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
        <FeaturedProducts />
        {/* Newsletter Section */}
        <section className="py-12 bg-gray-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">Stay updated with our latest products, exclusive offers, and discounts.</p>
            <form className="max-w-md mx-auto flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 border border-emerald-500 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900"
              />
              <button 
                type="submit" 
                className="bg-emerald-600 px-6 py-3 rounded-r-lg font-semibold hover:bg-emerald-700 transition-colors"
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