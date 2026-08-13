"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, Filter, X, ChevronUp, ChevronDown } from "lucide-react";
import { Category } from "@/services/categoryService";

interface ShopSidebarProps {
  categories: Category[];
  className?: string;
  onClose?: () => void;
}

export default function ShopSidebar({ categories, className = "", onClose }: ShopSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL
  const initialMinPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0;
  const initialMaxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 1000;
  const initialCategoryId = searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : null;

  const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(initialCategoryId);
  const [priceOpen, setPriceOpen] = useState(true);

  // Sync state when URL changes externally (e.g. back navigation or clear filters)
  useEffect(() => {
    setPriceRange([
      searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0,
      searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 1000,
    ]);
    setSelectedCategory(searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : null);
  }, [searchParams]);

  const handleCategoryClick = (catId: number | null) => {
    setSelectedCategory(catId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (catId) {
      params.set("categoryId", catId.toString());
    } else {
      params.delete("categoryId");
    }
    router.push(`/shop?${params.toString()}`);
    if (onClose) onClose();
  };

  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset to page 1 on new filters
    params.set("page", "1");
    
    // Price
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());

    // Category
    if (selectedCategory) {
      params.set("categoryId", selectedCategory.toString());
    } else {
      params.delete("categoryId");
    }

    router.push(`/shop?${params.toString()}`);
    if (onClose) onClose();
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-3xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Filters <Filter size={20} className="text-gray-400" />
        </h2>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-black">
            <X size={24} />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <ul className="space-y-3">
          <li>
            <button 
              onClick={() => handleCategoryClick(null)}
              className={`flex items-center w-full text-left transition-all capitalize ${
                selectedCategory === null 
                  ? 'font-bold text-black pl-1' 
                  : 'text-gray-500 hover:text-black hover:pl-1'
              }`}
            >
              All Products
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat.id}>
              <button 
                onClick={() => handleCategoryClick(cat.id)}
                className={`flex items-center w-full text-left transition-all capitalize ${
                  selectedCategory === cat.id 
                    ? 'font-bold text-black pl-1' 
                    : 'text-gray-500 hover:text-black hover:pl-1'
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Section */}
      <div className="mb-8">
        <button 
          onClick={() => setPriceOpen(!priceOpen)}
          className="flex items-center justify-between w-full font-bold text-lg mb-4 text-black"
        >
          Price
          {priceOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        {priceOpen && (
          <div className="space-y-6">
            {/* Range Slider Inputs */}
            <div className="flex flex-col gap-4">
              <div className="relative pt-1">
                <div className="flex items-center justify-between gap-4">
                  <div className="w-1/2">
                    <label className="text-xs text-gray-500 block mb-1">Min Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">EGP</span>
                      <input 
                        type="number" 
                        min="0" max="1000"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])}
                        className="w-full pl-11 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                  <div className="w-1/2">
                    <label className="text-xs text-gray-500 block mb-1">Max Price</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">EGP</span>
                      <input 
                        type="number" 
                        min="0" max="1000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])}
                        className="w-full pl-11 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider Inputs */}
              <div className="flex gap-2 items-center">
                <input 
                  type="range" 
                  min="0" max="1000" 
                  value={priceRange[0]} 
                  onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])}
                  className="w-1/2 accent-black h-1"
                />
                <input 
                  type="range" 
                  min="0" max="1000" 
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])}
                  className="w-1/2 accent-black h-1"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Apply Button */}
      <button 
        onClick={handleApplyFilter}
        className="w-full bg-black text-white font-medium py-4 rounded-full hover:bg-gray-900 transition-colors active:scale-95"
      >
        Apply Price Filter
      </button>
    </div>
  );
}
