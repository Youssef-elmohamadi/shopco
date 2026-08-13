"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ShoppingCart, User, ChevronDown, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface NavbarProps {
  isLoggedIn: boolean;
  userName: string | null;
  isProfileError: boolean;
  topCategories?: any[];
}

export default function Navbar({ isLoggedIn, userName, isProfileError, topCategories = [] }: NavbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartItems, removeFromCart, subtotal } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [searchVal, setSearchVal] = useState(searchParams.get("search") || "");

  // Instant search states
  const [searchResults, setSearchResults] = useState<{ products: any[]; categories: any[] }>({ products: [], categories: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchVal(searchParams.get("search") || "");
  }, [searchParams]);

  // Debounced search logic
  useEffect(() => {
    if (!searchVal.trim()) {
      setSearchResults({ products: [], categories: [] });
      setShowResults(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setShowResults(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchVal)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchVal]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
      if (
        mobileSearchContainerRef.current && 
        !mobileSearchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/shop?search=${encodeURIComponent(searchVal.trim())}`);
    setIsSearchOpen(false);
    setShowResults(false);
  };

  const renderSearchResults = () => {
    if (!showResults) return null;

    const hasProducts = searchResults.products?.length > 0;
    const hasCategories = searchResults.categories?.length > 0;

    return (
      <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl p-5 z-[200] max-h-[480px] overflow-y-auto transition-all">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-black dark:border-white border-t-transparent"></div>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">Searching...</span>
          </div>
        ) : !hasProducts && !hasCategories ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500 text-xs font-medium">
            No matches found for "{searchVal}"
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Categories */}
            {hasCategories && (
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-2">
                  Matching Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                  {searchResults.categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?categoryId=${cat.id}`}
                      onClick={() => {
                        setShowResults(false);
                        setSearchVal("");
                      }}
                      className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs text-gray-700 dark:text-gray-300 rounded-full font-medium transition cursor-pointer"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            {hasProducts && (
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-3">
                  Matching Products
                </h4>
                <div className="flex flex-col gap-2">
                  {searchResults.products.map((prod) => {
                    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://www.shopco.somee.com";
                    const firstImage = prod.images?.[0]?.url || "";
                    const imageUrl = firstImage.startsWith('http') ? firstImage : `${API_BASE_URL}${firstImage}`;

                    return (
                      <Link
                        key={prod.id}
                        href={`/product/${prod.id}`}
                        onClick={() => {
                          setShowResults(false);
                          setSearchVal("");
                        }}
                        className="flex gap-3 items-center hover:bg-gray-50 dark:hover:bg-gray-800/40 p-2 -mx-2 rounded-xl transition cursor-pointer"
                      >
                        <div className="relative w-10 h-10 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                          {firstImage ? (
                            <img
                              src={imageUrl}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="text-xs font-bold text-black dark:text-white truncate capitalize">
                            {prod.name}
                          </h4>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 capitalize">
                            In Category
                          </span>
                        </div>
                        <span className="text-xs font-extrabold text-black dark:text-white shrink-0">
                          {prod.discountPrice > 0 ? prod.discountPrice : prod.price} EGP
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="flex justify-between items-center h-16 sm:h-20">
        
        {/* Logo & Links */}
        <div className="flex items-center gap-4 sm:gap-8">
          {/* Mobile Menu Icon */}
          <button 
            className="md:hidden text-black dark:text-white"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              if (isSearchOpen) setIsSearchOpen(false);
            }}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href="/" className="text-2xl sm:text-3xl font-black tracking-tighter text-black dark:text-white">
            SHOP.CO
          </Link>
          <nav className="hidden md:flex items-center gap-5">
            <Link href="/shop" className="text-base font-bold text-gray-900 dark:text-gray-100 hover:opacity-80">
              Shop
            </Link>
            {topCategories && topCategories.map((cat: any) => (
              <Link 
                key={cat.id} 
                href={`/shop?categoryId=${cat.id}`} 
                className="text-base font-bold text-gray-900 dark:text-gray-100 hover:opacity-80 capitalize"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Desktop Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-md mx-8">
          <div ref={searchContainerRef} className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="block w-full pl-10 pr-3 py-2 border-none rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 sm:text-sm"
              placeholder="Search for products..."
            />
            {renderSearchResults()}
          </div>
        </form>

        {/* Icons */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Mobile Search Icon */}
          <button 
            className="lg:hidden text-gray-900 dark:text-white"
            onClick={() => {
              setIsSearchOpen(!isSearchOpen);
              if (isMenuOpen) setIsMenuOpen(false);
            }}
          >
            {isSearchOpen ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
          </button>
          
          <div 
            className="relative"
            onMouseEnter={() => setIsCartOpen(true)}
            onMouseLeave={() => setIsCartOpen(false)}
          >
            <Link href="/cart" className="relative p-1 text-gray-900 dark:text-white hover:opacity-80 flex items-center">
              <ShoppingCart className="h-6 w-6" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF3333] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* Cart Dropdown Popup */}
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-5 z-[100] transition-all">
                <h3 className="text-base font-bold text-black dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2">
                  Shopping Cart ({totalQuantity})
                </h3>
                
                {cartItems.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
                    Your cart is empty.
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-4 max-h-60 overflow-y-auto pr-1">
                      {cartItems.map((item) => {
                        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://www.shopco.somee.com";
                        const imageUrl = item.image.startsWith('http') ? item.image : `${API_BASE_URL}${item.image}`;
                        
                        return (
                          <div key={item.id} className="flex gap-3 items-center border-b border-gray-50 dark:border-gray-800/40 pb-3 last:border-b-0 last:pb-0">
                            <div className="relative w-12 h-12 bg-[#F0EEED] rounded-lg overflow-hidden shrink-0">
                              <img
                                src={imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="text-xs font-bold text-black dark:text-white truncate capitalize">{item.name}</h4>
                              <p className="text-[10px] text-gray-400 dark:text-gray-500 flex gap-2 mt-0.5">
                                {item.size && <span>Size: {item.size}</span>}
                                {item.colorName && <span>Color: {item.colorName}</span>}
                              </p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-xs font-bold text-black dark:text-white">{item.price} EGP</span>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500">Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 transition-colors shrink-0 cursor-pointer"
                              title="Delete Item"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4">
                      <div className="flex justify-between items-baseline mb-4">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Subtotal:</span>
                        <span className="text-base font-bold text-black dark:text-white">{subtotal} EGP</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          href="/cart"
                          className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white text-center py-2.5 rounded-full text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                          onClick={() => setIsCartOpen(false)}
                        >
                          View Cart
                        </Link>
                        <Link
                          href="/checkout"
                          className="bg-black dark:bg-white text-white dark:text-black text-center py-2.5 rounded-full text-xs font-bold hover:opacity-95 transition"
                          onClick={() => setIsCartOpen(false)}
                        >
                          Checkout
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          
          {isLoggedIn ? (
            <Link href="/profile" className="flex items-center gap-2 text-gray-900 dark:text-white hover:opacity-80">
              <User className="h-6 w-6" />
              <span className="text-sm font-medium hidden sm:block">
                {isProfileError ? "Error loading profile" : (userName || "Profile")}
              </span>
            </Link>
          ) : (
            <Link href="/signin" className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-full text-sm font-medium hover:opacity-80 transition">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search Input Dropdown */}
      {isSearchOpen && (
        <div className="lg:hidden absolute top-16 sm:top-20 left-0 w-full bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800 z-50">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-full">
            <div ref={mobileSearchContainerRef} className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchVal}
                onChange={(e) => {
                  setSearchVal(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                className="block w-full pl-10 pr-3 py-3 border-none rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                placeholder="Search for products..."
                autoFocus
              />
              {renderSearchResults()}
            </div>
          </form>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 sm:top-20 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40 shadow-lg">
          <nav className="flex flex-col px-6 py-6 gap-6">
            <Link href="/shop" className="text-lg font-bold text-gray-900 dark:text-gray-100" onClick={() => setIsMenuOpen(false)}>
              Shop
            </Link>
            {topCategories && topCategories.map((cat: any) => (
              <Link 
                key={cat.id} 
                href={`/shop?categoryId=${cat.id}`} 
                className="text-lg font-bold text-gray-900 dark:text-gray-100 capitalize" 
                onClick={() => setIsMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

