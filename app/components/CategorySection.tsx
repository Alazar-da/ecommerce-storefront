'use client';
import { useState, useEffect } from 'react';
import { Category } from '@/types/Category';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';


function CategorySection() {
  const [categories, setCategories] = useState([]);
  const route = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user }: { user: any } = useAuthStore();


  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/category');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (err:any) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategory = (category:Category) => {
    if (user) {
      localStorage.setItem("selectedCategory", JSON.stringify(category));
      route.push("/products");
    } else {
      toast.info('Please log in to view this category');
    }
  }
  if (loading) {
    return (
      <section id='Categories' className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center animate-pulse">
                <div className="bg-gray-300 rounded-full h-24 w-24 mx-auto mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2 mx-auto w-3/4"></div>
                <div className="bg-gray-200 h-3 rounded mx-auto w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id='Categories' className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="text-center text-red-600">
            <p>Error loading categories: {error}</p>
            <button 
              onClick={fetchCategories}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id='Categories' className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl text-emerald-600 font-bold text-center mb-12">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category:Category) => (
            <a 
              key={category._id} 
              onClick={()=>handleCategory(category)}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-500 hover:scale-105 transform hover:cursor-pointer"
            >
              <div className="bg-gray-200 rounded-full h-24 w-24 mx-auto mb-4 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="font-semibold mb-1 text-gray-800">{category.name}</h3>
              <p className="text-sm text-gray-600">{category.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;