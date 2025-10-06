'use client';
import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiHeart, FiMenu, FiX, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useSession, signOut } from "next-auth/react";
import Link from 'next/link';

// Header Component
const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const { data: session, status } = useSession();


  useEffect(() => {
    console.log("Session data:", session);
  }, [session]);

  // Create a ref for the dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

const handleUserActionClick = (/* e: React.MouseEvent */) => {
  setUserDropdownOpen(prev => !prev); // Toggle dropdown
/*   e.stopPropagation(); 
  if (user) {
    setUserDropdownOpen(prev => !prev); // ✅ works if logged in
  } else {
    setAuthModalOpen(true); // ❌ sets state, but no modal component exists
    setAuthMode('login');
    setUserDropdownOpen(false);
  } */
};


  const switchAuthMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
  };

  const handleLogout = () => {
   signOut();
    setUserDropdownOpen(false);
  };

  // Close mobile menu when a link is clicked
  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">ShopNow</Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-800 hover:text-blue-600 font-medium">Home</Link>
              <Link href="/products" className="text-gray-800 hover:text-blue-600 font-medium">Products</Link>
              <Link href="#" className="text-gray-800 hover:text-blue-600 font-medium">Categories</Link>
              <Link href="#" className="text-gray-800 hover:text-blue-600 font-medium">Deals</Link>
              <Link href="#" className="text-gray-800 hover:text-blue-600 font-medium">About</Link>
            </nav>

            {/* Search, Cart, and User Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <FiSearch className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="bg-transparent outline-none w-40 lg:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button className="p-2 text-gray-700 hover:text-blue-600 relative">
                <FiHeart className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>

              <Link href={'/cart'} className="p-2 text-gray-700 hover:text-blue-600 relative">
                <FiShoppingCart className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">2</span>
              </Link>

              <div className="relative" ref={dropdownRef}>
  <button 
    className="p-2 rounded-full transition-all duration-200 hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    onClick={() => setUserDropdownOpen(prev => !prev)}
  >
    <div className="relative">
      <i className="text-xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </i>
      {session?.user && (
        <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
          <span className="sr-only">User is logged in</span>
        </span>
      )}
    </div>
  </button>
  
  {/* User dropdown */}
  {userDropdownOpen && (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100 animate-fade-in">
      {session?.user ? (
        <>
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
            <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
          </div>
          
          <Link 
            href="/profile" 
            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
            onClick={handleMobileLinkClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </Link>
          
          <Link 
            href="/orders" 
            className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
            onClick={handleMobileLinkClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Orders
          </Link>
          
          <div className="border-t border-gray-100 my-1"></div>
          
          <button 
            onClick={() => {
              signOut();
              handleMobileLinkClick();
            }}
            className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link 
            href="/login"
            className="flex items-center px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors duration-150"
            onClick={handleMobileLinkClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Login
          </Link>
          
          <Link 
            href="/register"
            className="flex items-center px-4 py-3 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 mx-2 rounded-md transition-colors duration-150"
            onClick={handleMobileLinkClick}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Create Account
          </Link>
        </>
      )}
    </div>
  )}
</div>

              {/* Mobile menu button */}
              <button 
                className="md:hidden p-2 text-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-4 md:hidden">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <FiSearch className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 space-y-3">
              <Link href="/" className="block text-gray-800 hover:text-blue-600 font-medium py-2" onClick={handleMobileLinkClick}>Home</Link>
              <Link href="/products" className="block text-gray-800 hover:text-blue-600 font-medium py-2" onClick={handleMobileLinkClick}>Products</Link>
              <Link href="#" className="block text-gray-800 hover:text-blue-600 font-medium py-2" onClick={handleMobileLinkClick}>Categories</Link>
              <Link href="#" className="block text-gray-800 hover:text-blue-600 font-medium py-2" onClick={handleMobileLinkClick}>Deals</Link>
              <Link href="#" className="block text-gray-800 hover:text-blue-600 font-medium py-2" onClick={handleMobileLinkClick}>About</Link>
              
              {/* Mobile user actions */}
             {/*  {user ? (
                <div className="pt-2 border-t">
                  <p className="px-4 py-2 text-sm font-medium">{user.userName}</p>
                  <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={handleMobileLinkClick}>Profile</Link>
                  <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={handleMobileLinkClick}>Orders</Link>
                  <button 
                    onClick={() => {
                      logout();
                      handleMobileLinkClick();
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t flex flex-col space-y-2">
                  <Link 
                    href="/login"
                    className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    onClick={handleMobileLinkClick}
                  >
                    <FiLogIn className="mr-2" /> Login
                  </Link>
                  <Link 
                    href="/register"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                    onClick={handleMobileLinkClick}
                  >
                    <FiUserPlus className="mr-2" /> Register
                  </Link>
                </div>
              )} */}
            </nav>
          )}

          
        </div>
      </header>
    </>
  );
};

export default Header;