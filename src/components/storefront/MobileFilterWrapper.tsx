"use client";

import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import ShopSidebar from "./ShopSidebar";
import { Category } from "@/services/categoryService";

interface MobileFilterWrapperProps {
  categories: Category[];
}

export default function MobileFilterWrapper({ categories }: MobileFilterWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 flex items-center justify-center bg-[#F0F0F0] rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Open Filters"
      >
        <SlidersHorizontal size={20} className="text-black" />
      </button>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer Content */}
      <div 
        className={`fixed inset-y-0 right-0 z-[110] w-full sm:w-96 bg-white overflow-y-auto transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full">
          {/* We reuse the ShopSidebar but hide its normal desktop border/padding if we want, or just pass a class */}
          <ShopSidebar 
            categories={categories} 
            className="border-none rounded-none min-h-full" 
            onClose={() => setIsOpen(false)} 
          />
        </div>
      </div>
    </>
  );
}
