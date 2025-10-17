"use client";
import React, { useState,useEffect } from 'react';
import {  FiGrid, FiList, FiEdit, FiTrash2, FiSearch, FiEye, FiChevronRight, FiChevronsRight, FiChevronLeft, FiChevronsLeft } from 'react-icons/fi';
import DeletePopup from '../components/DeletePopup';
import ViewPopup from '../components/ViewPopup';
import Sidebar from '../components/sidebar';
import ProductFormModal from "../components/ProductFormModal";
import {Product} from "@/types/Product";
import { Category } from "@/types/Category";
import {shortDate} from '@/utils/date';
import { toast } from 'react-toastify';
import { formatPrice } from '@/utils/formatPrice';

const ProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState('products');
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);


    const totalPages = Math.ceil(total / limit);
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate page numbers to display
  const getPageNumbers = () => {
    if (totalPages <= 1) return [1];
    
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

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

// ✅ Fetch products with search, filter, pagination
const fetchProducts = async () => {
  try {
    setLoading(true);

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (categoryId) params.append("categoryId", categoryId);
    if (search) params.append("q", search); // ✅ updated key

    const url = `/api/product?${params.toString()}`;
    const res = await fetch(url);
    const data = await res.json();

    setProducts(data.products);
    setTotal(data.total);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching products:", err);
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProducts();
  }, [search, categoryId, page, limit]);


  const [deletePopup, setDeletePopup] = useState({
    isOpen: false,
    id: null as string | null,
    name: ''
  });
   const [viewPopup, setViewPopup] = useState({
    isOpen: false,
    product: null as Product | null
  });

   const [isOpen, setIsOpen] = useState(false);

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

    // Function to close the popup
  const handleClosePopup = () => {
    setViewPopup({
      isOpen: false,
      product: null
    });
  };

  // Function to open the delete popup
  const handleDeleteClick = (id: string, name: string) => {
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

const handleSave = (product: Product) => {
console.log('Product saved:', product);
}

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
        />
      )}
            <section className="w-full py-5 px-3 lg:px-5 mb-0">
            
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 mt-6 lg:mt-0">
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
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
          
          <button  onClick={() => setIsOpen(true)} className="w-full py-2 px-4 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 hover:cursor-pointer"
         >
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
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          {/* Category filter */}
          <div className="md:ml-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
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
    <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
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
           <div className="overflow-x-auto">
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
              {products.map((product: Product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="">
                          <div className="text-sm font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{formatPrice(product.price, product.currency)} Birr</td>
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

           
             {/* Pagination */}
                     {products.length === 0 ? (
                       <div className="text-center py-12">
                         <div className="text-gray-400 text-lg mb-2">No products found</div>
                         <div className="text-gray-500 text-sm">Try adjusting your search or filters</div>
                       </div>
                     ) : (
                       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-gray-200">
                         {/* Results info */}
                         <div className="text-sm text-gray-600">
                           Showing <span className="font-semibold text-gray-900">{startItem}</span> -{' '}
                           <span className="font-semibold text-gray-900">{endItem}</span> of{' '}
                           <span className="font-semibold text-gray-900">{total.toLocaleString()}</span> products
                         </div>
       
                         {/* Pagination controls */}
                         <div className="flex items-center gap-1">
                           <button
                             onClick={() => setPage(1)}
                             disabled={page === 1}
                             className={`p-2 border rounded-lg transition-all duration-200 ${
                               page === 1
                                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                                 : 'bg-white border-gray-300 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600'
                             }`}
                             aria-label="First page"
                           >
                             <FiChevronsLeft className="text-lg" />
                           </button>
       
                           <button
                             onClick={() => setPage(page - 1)}
                             disabled={page === 1}
                             className={`p-2 border rounded-lg transition-all duration-200 ${
                               page === 1
                                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                                 : 'bg-white border-gray-300 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600'
                             }`}
                             aria-label="Previous page"
                           >
                             <FiChevronLeft className="text-lg" />
                           </button>
       
                           {/* Page numbers */}
                           <div className="flex items-center gap-1 mx-2">
                             {getPageNumbers().map((pageNum) => (
                               <button
                                 key={pageNum}
                                 onClick={() => setPage(pageNum)}
                                 className={`min-w-[2.5rem] px-3 py-2 border text-sm font-medium rounded-lg transition-all duration-200 ${
                                   page === pageNum
                                     ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                                     : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                                 }`}
                                 aria-label={`Page ${pageNum}`}
                                 aria-current={page === pageNum ? 'page' : undefined}
                               >
                                 {pageNum}
                               </button>
                             ))}
                           </div>
       
                           <button
                             onClick={() => setPage(page + 1)}
                             disabled={page >= totalPages}
                             className={`p-2 border rounded-lg transition-all duration-200 ${
                               page >= totalPages
                                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                                 : 'bg-white border-gray-300 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600'
                             }`}
                             aria-label="Next page"
                           >
                             <FiChevronRight className="text-lg" />
                           </button>
       
                           <button
                             onClick={() => setPage(totalPages)}
                             disabled={page >= totalPages}
                             className={`p-2 border rounded-lg transition-all duration-200 ${
                               page >= totalPages
                                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300'
                                 : 'bg-white border-gray-300 text-gray-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-600'
                             }`}
                             aria-label="Last page"
                           >
                             <FiChevronsRight className="text-lg" />
                           </button>
                         </div>
       
                         {/* Page size selector */}
                         <div className="flex items-center gap-2 text-sm text-gray-600">
                           <span>Rows per page:</span>
                           <select
                             className="border border-gray-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                             onChange={(e) => {
                               setLimit(Number(e.target.value));
                               setPage(1);
                             }}
                             value={limit}
                           >
                             <option value="10">10</option>
                             <option value="20">20</option>
                             <option value="50">50</option>
                             <option value="100">100</option>
                           </select>
                         </div>
                       </div>
                     )}
          </div>
        )}

        {/* Card View */}
        {viewMode === 'card' && (
          <div className="p-4 overflow-y-auto md:h-[70vh] w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product: Product) => (
                <div key={product._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="ml-4 flex-1">
                        <div className='flex justify-between'>
                          <span>
                        <h3 className="text-sm font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
</span>
                          {
                  product.featured && ( <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded h-fit">Featured</span> )
                }
              
                </div>
                        <div className="mt-2 flex items-center">
                          <span className="text-sm font-medium">{formatPrice(product.price,product.currency)}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-sm text-gray-500">{product.categoryId.name}</span>
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
                        onClick={() => handleEdit(product)}
                        aria-label="Edit product"
                      >
                        <FiEdit className="text-lg" title={`Edit ${product.name}`} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 p-1 hover:cursor-pointer"
                        onClick={() => handleDeleteClick(product._id, product.name)}
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
