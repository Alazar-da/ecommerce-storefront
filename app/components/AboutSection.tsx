import React from 'react'
import Link from 'next/link';

function AboutSection() {
  return (
<section id="About" className="py-20 bg-white">
  <div className="container mx-auto px-4">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Content Side */}
      <div className="space-y-8">
        {/* Section Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
            About Our Store
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Welcome to
            <span className="block text-emerald-600">ShopNow</span>
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            At ShopNow, we believe that shopping should be an experience, not just a transaction. 
            Since 2015, we've been committed to bringing you the best products at the most competitive prices, 
            with customer service that goes above and beyond.
          </p>
        </div>

        {/* Our Story */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">Our Story</h3>
          <p className="text-gray-600">
            What started as a small family business has grown into one of the most trusted online retailers. 
            Our journey began with a simple mission: to make quality products accessible to everyone, everywhere.
          </p>
        </div>

        {/* Key Points */}
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Quality Guaranteed</h4>
              <p className="text-gray-600">Every product is carefully selected and tested to meet our high standards.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Fast Shipping</h4>
              <p className="text-gray-600">Free shipping on orders over $50. Most items delivered within 2-3 business days.</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">24/7 Support</h4>
              <p className="text-gray-600">Our customer service team is always here to help you with any questions.</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">50K+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">100+</div>
            <div className="text-sm text-gray-600">Brands</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600">10K+</div>
            <div className="text-sm text-gray-600">Products</div>
          </div>
        </div>
      </div>

      {/* Image Side */}
      <div className="relative">
        <div className="grid grid-cols-2 gap-4">
          {/* Main Image */}
          <div className="col-span-2">
            <div className="aspect-video bg-gradient-to-br from-emerald-50 to-gray-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">Our Modern Warehouse</p>
              </div>
            </div>
          </div>
          
          {/* Small Images */}
          <div className="aspect-square bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-gray-600">Global Shipping</p>
            </div>
          </div>
          
          <div className="aspect-square bg-gradient-to-br from-cyan-50 to-pink-50 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <p className="text-xs text-gray-600">24/7 Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Values Section */}
    <div className="mt-20 grid md:grid-cols-3 gap-8">
      <div className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-300">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
        <p className="text-gray-600">
          To provide high-quality products with exceptional customer service, making online shopping 
          convenient, reliable, and enjoyable for everyone.
        </p>
      </div>

      <div className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-300">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h3>
        <p className="text-gray-600">
          To become the most trusted online shopping destination, known for our commitment to 
          quality, value, and customer satisfaction.
        </p>
      </div>

      <div className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow duration-300">
        <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Promise</h3>
        <p className="text-gray-600">
          We promise to always put our customers first, offering competitive prices, fast shipping, 
          and outstanding support for every purchase.
        </p>
      </div>
    </div>
  </div>
</section>
  )
}

export default AboutSection