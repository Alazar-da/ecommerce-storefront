'use client';
import React from 'react'
import Link from 'next/link';

function HeroSection() {
  return (
 
<section id='Home' className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-teal-700 to-slate-900">
  {/* Animated Background Elements 
  <div className="absolute inset-0">
    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
    <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-lime-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
    
    {/* Grid Pattern Overlay
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
  </div>
*/}
 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

  <div className="container mx-auto px-4 relative z-10">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Content */}
      <div className="text-center lg:text-left space-y-8 py-1">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping"></span>
          <span className="text-sm font-medium text-white/90">Limited Time Offer</span>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
            Summer
            <span className="block bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Sale 50% Off
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl">
            Discover exclusive deals on premium products. Limited time offer with 
            <span className="font-semibold text-green-300"> free shipping </span>
            on all orders.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">500+</div>
            <div className="text-sm text-gray-300">Premium Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-sm text-gray-300">Customer Support</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-sm text-gray-300">Satisfaction Guaranteed</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link 
            href="/products" 
            className="group relative bg-gradient-to-r from-green-600 to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-green-500 hover:to-emerald-600 duration-300 backdrop-blur-sm transform hover:scale-105 flex items-center justify-center"
          >
            <span className="relative z-10 flex items-center">
              Shop Now
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-md"></div>
          </Link>

          <Link 
            href="#features" 
            className="group border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <span className="flex items-center">
              Learn More
              <svg className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-8">
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Free Shipping Worldwide</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>30-Day Money Back</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Visual Element - Product Showcase */}
      <div className="relative hidden lg:block">
        <div className="relative">
          {/* Image */}
          
        <img
          src="/Hero.png"
          alt="Hero Image"
          className="w-full max-w-md mx-auto rounded-3xl bg-emerald-100 shadow-2xl animate-float"
        />
          </div>
      </div>
    </div>

    {/* Scroll Indicator */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
      <div className="animate-bounce">
        <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  </div>

  {/* Add custom animations to your global CSS */}
  <style jsx global>{`
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
  `}</style>
</section>
  )
}

export default HeroSection