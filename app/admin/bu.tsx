'use client'
import { useState } from 'react';
import { FiHome, FiBox, FiShoppingCart, FiUsers, FiSettings, FiPieChart, FiLogOut, FiMenu, FiX, FiEdit, FiTrash2, FiPlus, FiSearch, FiUser } from 'react-icons/fi';

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: 'published' | 'draft';
}

interface Order {
  id: number;
  customer: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
}

// Mock data
const products: Product[] = [
  { id: 1, name: 'Wireless Headphones', price: 199.99, stock: 45, category: 'Electronics', status: 'published' },
  { id: 2, name: 'Running Shoes', price: 89.99, stock: 120, category: 'Footwear', status: 'published' },
  { id: 3, name: 'Cotton T-Shirt', price: 24.99, stock: 0, category: 'Clothing', status: 'draft' },
  { id: 4, name: 'Smart Watch', price: 249.99, stock: 30, category: 'Electronics', status: 'published' },
  { id: 5, name: 'Coffee Maker', price: 79.99, stock: 25, category: 'Appliances', status: 'published' },
];

const orders: Order[] = [
  { id: 1001, customer: 'John Smith', date: '2023-04-15', total: 199.99, status: 'delivered' },
  { id: 1002, customer: 'Emma Johnson', date: '2023-04-16', total: 314.98, status: 'processing' },
  { id: 1003, customer: 'Michael Brown', date: '2023-04-16', total: 89.99, status: 'pending' },
  { id: 1004, customer: 'Sarah Davis', date: '2023-04-17', total: 549.97, status: 'processing' },
  { id: 1005, customer: 'Robert Wilson', date: '2023-04-17', total: 249.99, status: 'delivered' },
];

const AdminSidebar = ({ activePage, setActivePage, sidebarOpen, setSidebarOpen }: { 
  activePage: string, 
  setActivePage: (page: string) => void,
  sidebarOpen: boolean,
  setSidebarOpen: (open: boolean) => void
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome className="text-lg" /> },
    { id: 'products', label: 'Products', icon: <FiBox className="text-lg" /> },
    { id: 'orders', label: 'Orders', icon: <FiShoppingCart className="text-lg" /> },
    { id: 'customers', label: 'Customers', icon: <FiUsers className="text-lg" /> },
    { id: 'analytics', label: 'Analytics', icon: <FiPieChart className="text-lg" /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings className="text-lg" /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          <span className="text-white font-bold text-xl">Admin Panel</span>
          <button 
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <FiX className="text-xl" />
          </button>
        </div>
        
        <nav className="mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 ${activePage === item.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button className="flex items-center w-full px-4 py-2 text-left text-gray-300 hover:text-white">
            <FiLogOut className="mr-3 text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

const DashboardHome = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiShoppingCart className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              <h3 className="text-xl font-semibold text-gray-800">$24,563</h3>
            </div>
          </div>
          <p className="mt-2 text-sm text-green-600">+12.5% from last month</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FiBox className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <h3 className="text-xl font-semibold text-gray-800">1,258</h3>
            </div>
          </div>
          <p className="mt-2 text-sm text-green-600">+8.2% from last month</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FiUsers className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <h3 className="text-xl font-semibold text-gray-800">5,372</h3>
            </div>
          </div>
          <p className="mt-2 text-sm text-green-600">+3.7% from last month</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FiPieChart className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <h3 className="text-xl font-semibold text-gray-800">2,487</h3>
            </div>
          </div>
          <p className="mt-2 text-sm text-red-600">-1.2% from last month</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 whitespace-nowrap">#{order.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{order.customer}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{order.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProductManagement = ({ setActivePage, setEditProductId }: { 
  setActivePage: (page: string) => void, 
  setEditProductId: (id: number | null) => void 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: number) => {
    setEditProductId(id);
    setActivePage('edit-product');
  };

  const handleDelete = (id: number) => {
    // In a real app, this would show a confirmation dialog and then call an API
    console.log(`Delete product with id: ${id}`);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
        <button 
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => {
            setEditProductId(null);
            setActivePage('new-product');
          }}
        >
          <FiPlus className="mr-2" />
          Add New Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
                        {/* Product image would go here */}
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => handleEdit(product.id)}
                    >
                      <FiEdit className="inline" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(product.id)}
                    >
                      <FiTrash2 className="inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ProductForm = ({ productId }: { productId: number | null }) => {
  const isEditing = productId !== null;
  const product = isEditing ? products.find(p => p.id === productId) : null;
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    category: product?.category || '',
    status: product?.status || 'draft',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to save the product
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                id="stock"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEditing ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OrdersManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders Management</h1>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center">
          <div className="mb-4 md:mb-0 md:mr-4">
            <label htmlFor="status-filter" className="sr-only">Filter by status</label>
            <select
              id="status-filter"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 whitespace-nowrap">#{order.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{order.customer}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{order.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      className={`px-2 py-1 text-xs rounded-full border-0 focus:ring-2 focus:ring-opacity-50 ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800 focus:ring-green-500' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800 focus:ring-blue-500' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 focus:ring-yellow-500' :
                        'bg-red-100 text-red-800 focus:ring-red-500'
                      }`}
                      value={order.status}
                      onChange={(e) => console.log(`Update order ${order.id} status to ${e.target.value}`)}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <button 
              className="lg:hidden text-gray-600 mr-4"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu className="text-xl" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {activePage === 'dashboard' && 'Dashboard'}
              {activePage === 'products' && 'Product Management'}
              {activePage === 'new-product' && 'Add New Product'}
              {activePage === 'edit-product' && 'Edit Product'}
              {activePage === 'orders' && 'Orders Management'}
              {activePage === 'customers' && 'Customer Management'}
              {activePage === 'analytics' && 'Analytics'}
              {activePage === 'settings' && 'Settings'}
            </h2>
          </div>
          
          <div className="flex items-center">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <FiSearch className="text-xl" />
            </button>
            <button className="ml-4 p-2 text-gray-600 hover:text-gray-900">
              <FiUser className="text-xl" />
            </button>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activePage === 'dashboard' && <DashboardHome />}
          {activePage === 'products' && <ProductManagement setActivePage={setActivePage} setEditProductId={setEditProductId} />}
          {(activePage === 'new-product' || activePage === 'edit-product') && <ProductForm productId={editProductId} />}
          {activePage === 'orders' && <OrdersManagement />}
          
          {/* Placeholder for other pages */}
          {(activePage === 'customers' || activePage === 'analytics' || activePage === 'settings') && (
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {activePage.charAt(0).toUpperCase() + activePage.slice(1)} Page
              </h1>
              <p className="text-gray-600">This page is under development.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;