"use client";
import React, { useState,useEffect } from 'react';
import {  FiGrid, FiList, FiEdit, FiTrash2, FiPlus, FiSearch, FiEye } from 'react-icons/fi';
import DeletePopup from '../components/DeletePopup';
import ViewPopup from '../components/ViewPopup';
import Sidebar from '../components/sidebar';
import ProductFormModal from "../components/ProductFormModal";
import {Product} from "@/types/Product";
import { Category } from "@/types/Category";
import { Order } from '@/types/Order';
import {shortDate} from '@/utils/date';
import { toast } from 'react-toastify';

const ProductPage = () => {
  const [loading, setLoading] = useState(false);
   const [activePage, setActivePage] = useState('products');
  const [categories, setCategories] = useState<Category[]>([]);
     const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/getCategories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products with filters
  const fetchProducts = async () => {
    let url = "/api/product";
   setLoading(true)
    const params = new URLSearchParams();
    if (categoryId) params.append("categoryId", categoryId);
    if (search) params.append("search", search);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setProducts(data);
    console.log("Fetched products:", data);
    setLoading(false)
  };

  useEffect(() => {
    fetchProducts();
  }, [search, categoryId]);


 // Fetch single category
/* const fetchCategoryById = async (categoryId: string) => {
  try {
    const response = await fetch(`/api/categories/${categoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }
    const category = await response.json();
    return category.name;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}; */


  const [deletePopup, setDeletePopup] = useState({
    isOpen: false,
    id: null as number | null,
    name: ''
  });
   const [viewPopup, setViewPopup] = useState({
    isOpen: false,
    product: null as Product | null
  });




   const [isOpen, setIsOpen] = useState(false);

  const handleSave = (product: any) => {
    console.log("Saved product:", product);
    // 👉 send product to your API / MongoDB here
  };




  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');


 // Open modal for editing
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsOpen(true);
  };

  // Function to open the view popup
  const handleViewClick = (product: Product) => {
    setViewPopup({
      isOpen: true,
      product
    });
  };

  // Function to handle add to cart
  const handleAddToCart = (product: Product) => {
    console.log('Adding to cart:', product);
    // Your add to cart logic here
  };

    // Function to close the popup
  const handleClosePopup = () => {
    setViewPopup({
      isOpen: false,
      product: null
    });
  };

  // Function to open the delete popup
  const handleDeleteClick = (id: number, name: string) => {
    setDeletePopup({
      isOpen: true,
      id,
      name
    });
  };
    // Function to handle confirmed deletion
 const handleDeleteConfirm = async (id: number | string) => {
  try {
    const response = await fetch(`/api/product/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete product');
    }

    toast.success('Product deleted successfully');

    // 👉 remove product from local state
    setProducts(prev => prev.filter(p => p._id !== id));

  } catch (error) {
    console.error('Delete error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    toast.error(`Delete failed: ${errorMessage}`);
  } finally {
    setDeletePopup({ isOpen: false, id: null, name: '' });
  }
};

   // Function to handle cancellation
  const handleDeleteCancel = () => {
    setDeletePopup({
      isOpen: false,
      id: null,
      name: ''
    });
  };

  return (
       <main className="flex min-h-screen bg-gray-100 w-full text-slate-800 pb-6 md:pb-0">
      {/* Include the Sidebar component */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        
      />
       <ProductFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
      />

       <ProductFormModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        initialData={editingProduct}
      />


      {/* Delete Popup */}
      <DeletePopup
        id={deletePopup.id || ''}
        itemName={deletePopup.name}
        isOpen={deletePopup.isOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* View Popup */}
    {viewPopup.product && (
        <ViewPopup
          product={viewPopup.product}
          isOpen={viewPopup.isOpen}
          onClose={handleClosePopup}
          onAddToCart={handleAddToCart}
        />
      )}
            <section className="w-full p-5 pb-0 mb-0">
            
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          {/* View mode toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              className={`p-2 rounded-md hover:cursor-pointer ${viewMode === 'table' ? 'bg-white shadow' : 'text-gray-500'}`}
              onClick={() => setViewMode('table')}
              aria-label="Table view"
            >
              <FiList className="text-lg" />
            </button>
            <button
              className={`p-2 rounded-md hover:cursor-pointer ${viewMode === 'card' ? 'bg-white shadow' : 'text-gray-500'}`}
              onClick={() => setViewMode('card')}
              aria-label="Card view"
            >
              <FiGrid className="text-lg" />
            </button>
          </div>
          
          <button  onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm hover:cursor-pointer">
            Add New Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
          {/* Search input */}
          <div className="relative max-w-md flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          {/* Category filter */}
          <div className="md:ml-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              
                <option key={'all'} value={'all'}>
                  All Categories
                  </option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table View */}
        
        {loading ? (
  <div className="flex justify-center items-center py-10">
    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    <span className="ml-3 text-gray-600">Loading products...</span>
  </div>
) : (
  <>
    {products.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        No products found matching your criteria.
      </div>
    ) : (
      <>
        {viewMode === 'table' && (
          <div className="table-auto md:table-fixed w-full md:w-[80vw] xl:w-full overflow-x-auto md:h-[70vh]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product: any) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="">
                          <div className="text-sm font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{product.price.toFixed(2)} Birr</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.categoryId.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' : 
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shortDate(product.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-900 hover:cursor-pointer"
                          onClick={() => handleViewClick(product)}
                          aria-label="View product"
                        >
                          <FiEye className="text-lg" title={`View ${product.name}`} />
                        </button>
                        <button 
                          className="text-green-600 hover:text-green-900 hover:cursor-pointer"
                          onClick={() => handleEdit(product)}
                          aria-label="Edit product"
                        >
                          <FiEdit className="text-lg" title={`Edit ${product.name}`} />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900 hover:cursor-pointer"
                          onClick={() => handleDeleteClick(product._id, product.name)}
                          aria-label="Delete product"
                        >
                          <FiTrash2 className="text-lg" title={`Delete ${product.name}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

           
           {/*  {products.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No products found matching your criteria.
              </div>
            )} */}
          </div>
        )}

        {/* Card View */}
        {viewMode === 'card' && (
          <div className="p-4 overflow-y-auto md:h-[70vh] w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product: any) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                        <div className="mt-2 flex items-center">
                          <span className="text-sm font-medium">{product.price.toFixed(2)} Birr</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-sm text-gray-500">{product.category}</span>
                        </div>
                        <div className="mt-2">
                          <span className={`px-2 py-1 text-xs font-medium inline-flex rounded-full ${
                            product.stock > 10 ? 'bg-green-100 text-green-800' : 
                            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Added: {shortDate(product.createdAt)}</span>
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900 p-1 hover:cursor-pointer"
                        onClick={() => handleViewClick(product)}
                        aria-label="View product"
                      >
                        <FiEye className="text-lg" title={`View ${product.name}`} />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900 p-1 hover:cursor-pointer"
                        onClick={() => handleEdit(product.id)}
                        aria-label="Edit product"
                      >
                        <FiEdit className="text-lg" title={`Edit ${product.name}`} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 p-1 hover:cursor-pointer"
                        onClick={() => handleDeleteClick(product.id, product.name)}
                        aria-label="Delete product"
                      >
                        <FiTrash2 className="text-lg" title={`Delete ${product.name}`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {products.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No products found matching your criteria.
              </div>
            )}
          </div>
        )}
      </>
    )
  }

     

  </>
)}
      </div>
    </section>
    </main>
  )
}

export default ProductPage;
