'use client'
import { useState } from 'react';
import { FiBox, FiShoppingCart, FiUsers, FiPieChart } from 'react-icons/fi';
import Sidebar from './components/sidebar';
import { orders } from '../data/data';

const DashboardHome = () => {
    const [activePage, setActivePage] = useState('dashboard');
 
  return (
    <main className="flex h-screen bg-gray-100 w-full text-slate-800">
      {/* Include the Sidebar component */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        
      />
      <section className="mb-6 overflow-y-auto w-full min-h-screen p-5">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
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
    </section>
    </main>
  );
};



export default DashboardHome;