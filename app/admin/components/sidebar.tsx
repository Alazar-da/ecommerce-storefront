'use client';
import React,{useState} from 'react'
import { FiHome, FiBox, FiShoppingCart, FiUsers, FiSettings, FiPieChart, FiLogOut, FiMenu, FiX, FiEdit, FiTrash2, FiPlus, FiSearch, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";

const Sidebar = ({ activePage, setActivePage }: { 
  activePage: string, 
  setActivePage: (page: string) => void

}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard',path:"/", icon: <FiHome className="text-lg" /> },
    { id: 'products', label: 'Products', path:"/products", icon: <FiBox className="text-lg" /> },
    { id: 'orders', label: 'Orders', path:"/orders", icon: <FiShoppingCart className="text-lg" /> },
    { id: 'customers', label: 'Customers', path:"/customers", icon: <FiUsers className="text-lg" /> },
    { id: 'analytics', label: 'Analytics', path:"/analytics", icon: <FiPieChart className="text-lg" /> },
    { id: 'settings', label: 'Settings', path:"/settings", icon: <FiSettings className="text-lg" /> },
  ];
 const [sidebarOpen, setSidebarOpen] = useState(false);
   const { data: session, status } = useSession();
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    {/* Mobile toggle button */}
    <button
      className="fixed top-4 right-4 z-40 p-2 rounded-md bg-gray-900 text-white lg:hidden flex"
      onClick={() => setSidebarOpen(true)}
      aria-label="Open sidebar"
      style={{ display: sidebarOpen ? 'none' : '' }}
    >
      <FiMenu className="text-2xl" />
    </button>
      {/* Sidebar */}
      <section className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 h-screen transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
            <Link
              key={item.id}
                  href={"/admin"+item.path}
              className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 hover:cursor-pointer ${activePage === item.id ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
        
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <div className='text-sm'>
            <div className="flex items-center">
              <FiUser className="text-gray-300 mr-2 text-lg" />
              <span className="text-gray-300 font-medium">{session?.user?.name || 'Admin User'}</span>
            </div>
          </div>
          <button onClick={() => {
                        signOut({
  callbackUrl: "/",         // 👈 redirect URL after sign out
});
                        
                      }} className="flex items-center w-full px-4 py-2 text-left text-gray-300 hover:text-red-300 hover:cursor-pointer">
            <FiLogOut className="mr-3 text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </section>
    </>

    );

}

export default Sidebar