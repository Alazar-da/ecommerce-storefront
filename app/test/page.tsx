// pages/test-categories.js
'use client';
import { Category } from '@/types/Category';
import { useState, useEffect } from 'react';

export default function TestCategories() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [testData, setTestData] = useState({
    name: 'Test Category',
    description: 'This is a test category',
    image: 'https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg'
  });
  const [status, setStatus] = useState({ message: '', type: '' });

  useEffect(() => {
    // Fetch categories when component mounts
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/category');
      
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        setStatus({ message: `Successfully fetched ${data.length} categories`, type: 'success' });
      } else {
        const errorData = await response.json();
        setStatus({ message: `Failed to fetch categories: ${errorData.message || response.status}`, type: 'error' });
      }
    } catch (error:any) {
      console.error('Error fetching categories:', error);
      setStatus({ message: `Error fetching categories: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const createTestCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      
      if (response.ok) {
        const newCategory = await response.json();
        setStatus({ message: 'Test category created successfully!', type: 'success' });
        
        // Refresh the categories list
        await fetchCategories();
        
        // Reset form
        setTestData({
          name: 'Test Category',
          description: 'This is a test category',
          image: 'https://www.arkema.com/files/live/sites/shared_arkema/files/images/markets/Electronics%20electrical/electronics.jpg'
        });
      } else {
        const errorData = await response.json();
        setStatus({ message: `Failed to create category: ${errorData.message || response.status}`, type: 'error' });
      }
    } catch (error:any) {
      console.error('Error creating category:', error);
      setStatus({ message: `Error creating category: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const clearStatus = () => {
    setStatus({ message: '', type: '' });
  };

  return (
    <main className='min-h-screen bg-white py-10'>
      <div className="bg-slate-100 p-5 font-sans max-w-3xl mx-auto text-slate-800">
        <h1 className="text-gray-800 mb-5 text-2xl font-bold">Categories API Test</h1>

      {status.message && (
      <div
        className={`flex justify-between items-center p-2.5 mb-5 rounded border ${
        status.type === 'success'
          ? 'bg-green-100 text-green-800 border-green-200'
          : 'bg-red-100 text-red-800 border-red-200'
        }`}
      >
        <span>{status.message}</span>
        <button
        onClick={clearStatus}
        className="bg-transparent border-none text-xl cursor-pointer text-red-800"
        >
        ×
        </button>
      </div>
      )}

      <div className="bg-gray-50 p-5 rounded-lg mb-5 border border-gray-200">
      <h2 className="text-gray-700 mb-4 text-xl font-semibold">Create New Category</h2>

      <div className="mb-4">
        <label className="block mb-1 font-bold">Name:</label>
        <input
        type="text"
        value={testData.name}
        onChange={(e) => setTestData({ ...testData, name: e.target.value })}
        className="p-2.5 w-full border border-gray-300 rounded text-base"
        disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-bold">Description:</label>
        <input
        type="text"
        value={testData.description}
        onChange={(e) => setTestData({ ...testData, description: e.target.value })}
        className="p-2.5 w-full border border-gray-300 rounded text-base"
        disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-bold">Image URL:</label>
        <input
        type="text"
        value={testData.image}
        onChange={(e) => setTestData({ ...testData, image: e.target.value })}
        className="p-2.5 w-full border border-gray-300 rounded text-base"
        disabled={loading}
        />
      </div>

      <button
        onClick={createTestCategory}
        disabled={loading}
        className={`p-2.5 px-5 rounded font-bold text-base ${
        loading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-green-600 hover:bg-green-700 cursor-pointer'
        } text-white border-none`}
      >
        {loading ? 'Creating...' : 'Create Category'}
      </button>
      </div>

      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-700 text-xl font-semibold m-0">
        Existing Categories ({categories.length})
        </h2>
        <button
        onClick={fetchCategories}
        disabled={loading}
        className={`p-2 px-4 rounded text-sm ${
          loading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
        } text-white border-none`}
        >
        {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {categories.length > 0 ? (
        <div className="grid gap-4">
        {categories.map((category: Category) => (
          <div
          key={category._id}
          className="p-4 border border-gray-300 rounded bg-white"
          >
          <h3 className="mb-2 text-lg font-bold text-gray-900">{category.name}</h3>
          <p className="mb-2 text-gray-600">{category.description}</p>
          {category.image && (
            <div className="mt-2">
            <img
              src={category.image}
              alt={category.name}
              className="max-w-[100px] h-auto rounded"
            />
            </div>
          )}
          <p className="mt-2 text-xs text-gray-400">ID: {category._id}</p>
          </div>
        ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center p-5">
        {loading ? 'Loading categories...' : 'No categories found. Create one above!'}
        </p>
      )}
      </div>
    </div>
  </main>
  );
}