'use client';
import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useAuthStore } from "@/store/useAuthStore";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const router = useRouter();
  const { user, logout }:{user:any, logout: () => void} = useAuthStore();

   const signOut = () => {
        toast.success("Logged out successfully");
    setTimeout(() =>
          {
  localStorage.removeItem("token");
   
    logout();
    router.push("/")
    }, 2000)
    setUserDropdownOpen(false);
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

    const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await fetch(`/api/cart/count?id=${user.id}`);
        const data = await res.json();
        setCartCount(data.count);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCartCount();
  }, [user?.id]);

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

  const handleUserActionClick = () => {
    setUserDropdownOpen(prev => !prev);
  };

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 text-sm text-center">
        <p>🎉 Free shipping on orders over $50! Limited time offer.</p>
      </div>

      <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100 ">
        <div className=" mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SF</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">
                  Store Front
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link 
                href="#Home"
                className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 hover:bg-emerald-50 rounded-lg"
              >
                Home
              </Link>
               <Link 
                href="#About" 
                className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 hover:bg-emerald-50 rounded-lg"
              >
                About
              </Link>
               <Link 
                href="#Categories" 
                className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 hover:bg-emerald-50 rounded-lg"
              >
                Categories
              </Link>
              <Link 
                href="#Products" 
                className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 hover:bg-emerald-50 rounded-lg"
              >
                Products
              </Link>
               
             
             {/*  <Link 
                href="#" 
                className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 hover:bg-emerald-50 rounded-lg"
              >
                Deals
              </Link> */}
             
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-sm mx-8">
              <div className="relative w-full">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for products, brands..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Wishlist */}
          {/*     {session?.user ? (
              <button className="p-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 relative group">
                <FiHeart className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  3
                </span>
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Wishlist
                </span>
              </button>
              ) : null} */}

              {/* Cart */}
              {user ? (
              <Link 
                href="/cart" 
                className="p-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 relative group"
              >
                <FiShoppingCart className="text-xl" />
                {cartCount!==0? <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  {cartCount}
                </span>:null}
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Cart
                </span>
              </Link>
              ) : null}

              {/* User Account */}
              <div className="relative hidden lg:flex" ref={dropdownRef}>
                <button 
                  className="p-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 relative group hover:cursor-pointer"
                  onClick={handleUserActionClick}
                >
                  <div className="relative">
                    {user ? (
                      <div className="w-6 h-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <FiUser className="text-2xl" />
                    )}
                    {user && (
                      <span className="absolute -top-1 -right-1 bg-green-500 border-2 border-white rounded-full w-3 h-3"></span>
                    )}
                  </div>
                  <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Account
                  </span>
                </button>
                
                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl py-3 z-50 border border-gray-100 animate-fade-in">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        
                        <Link 
                          href="/profile" 
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 hover:cursor-pointer"
                          onClick={handleMobileLinkClick}
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <FiUser className="text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">Profile</p>
                            <p className="text-xs text-gray-500">Manage your account</p>
                          </div>
                        </Link>
                        
                        <Link 
                          href="/orders" 
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
                          onClick={handleMobileLinkClick}
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <FiShoppingCart className="text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">Orders</p>
                            <p className="text-xs text-gray-500">View your orders</p>
                          </div>
                        </Link>
                        
                        <div className="border-t border-gray-100 my-2"></div>
                        
                        <button 
                        type='button'
                          onClick={() => {
                            signOut();
                            handleMobileLinkClick();
                          }}
                          className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg mx-2 hover:cursor-pointer"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                            <FiLogOut className="text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">Logout</p>
                            <p className="text-xs text-red-500">Sign out of your account</p>
                          </div>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">Welcome!</p>
                          <p className="text-xs text-gray-500">Sign in to your account</p>
                        </div>
                        
                        <Link 
                          href="/login"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
                          onClick={handleMobileLinkClick}
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <FiLogIn className="text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">Login</p>
                            <p className="text-xs text-gray-500">Access your account</p>
                          </div>
                        </Link>
                        
                        <Link 
                          href="/register"
                          className="flex items-center px-4 py-3 text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-emerald-700 hover:to-green-700 mx-2 rounded-xl transition-all duration-200 mt-2"
                          onClick={handleMobileLinkClick}
                        >
                          <div className="w-8 h-8 bg-gray-100 bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                            <FiUserPlus className='text-gray-600'/>
                          </div>
                          <div>
                            <p className="font-medium">Create Account</p>
                            <p className="text-xs text-white text-opacity-90">Join us today</p>
                          </div>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button 
                className="lg:hidden p-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-4 md:hidden">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-6 pb-4 animate-slide-down">
              <nav className="space-y-2">
                <Link 
                  href="/" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium"
                  onClick={handleMobileLinkClick}
                >
                  Home
                </Link>
                 <Link 
                  href="#" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium"
                  onClick={handleMobileLinkClick}
                >
                  About
                </Link>
                <Link 
                  href="/products" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium"
                  onClick={handleMobileLinkClick}
                >
                  Products
                </Link>
                <Link 
                  href="#" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium"
                  onClick={handleMobileLinkClick}
                >
                  Categories
                </Link>
               {/*  <Link 
                  href="#" 
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium"
                  onClick={handleMobileLinkClick}
                >
                  Deals
                </Link> */}
               
              </nav>

              {/* Mobile user section */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-4 py-2">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link 
                      href="/profile" 
                      className="flex items-center px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 hover:cursor-pointer"
                      onClick={handleMobileLinkClick}
                    >
                      <FiUser className="mr-3" /> Profile
                    </Link>
                    <Link 
                      href="/orders" 
                      className="flex items-center px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 hover:cursor-pointer"
                      onClick={handleMobileLinkClick}
                    >
                      <FiShoppingCart className="mr-3" /> Orders
                    </Link>

                    <button 
                      type='button'
                      onClick={() => {
                        signOut();
                        handleMobileLinkClick();
                      }}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:cursor-pointer"
                    >
                      <FiLogOut className="mr-3" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link 
                      href="/login"
                      className="flex items-center px-4 py-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium hover:cursor-pointer"
                      onClick={handleMobileLinkClick}
                    >
                      <FiLogIn className="mr-3" /> Login
                    </Link>
                    <Link 
                      href="/register"
                      className="flex items-center px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-green-700 hover:to-emerald-700 rounded-xl transition-all duration-200 font-medium justify-center"
                      onClick={handleMobileLinkClick}
                    >
                      <FiUserPlus className="mr-3" /> Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Add custom animations to your global CSS */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Header;