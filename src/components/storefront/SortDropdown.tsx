"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

const sortOptions = [
  { label: "Most Popular", value: "popular" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest", value: "date_desc" },
];

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentSortBy = searchParams.get("sortBy") || "";
  const currentSortDescending = searchParams.get("sortDescending") === "true";

  let currentValue = "popular";
  if (currentSortBy === "price") {
    currentValue = currentSortDescending ? "price_desc" : "price_asc";
  } else if (currentSortBy === "date") {
    currentValue = "date_desc";
  } else if (currentSortBy === "popular") {
    currentValue = "popular";
  }

  const activeOption = sortOptions.find(opt => opt.value === currentValue) || sortOptions[0];

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset to page 1 on sort change
    params.set("page", "1");
    
    if (!value || value === "popular") {
      params.set("sortBy", "popular");
      params.delete("sortDescending");
    } else if (value === "price_asc") {
      params.set("sortBy", "price");
      params.set("sortDescending", "false");
    } else if (value === "price_desc") {
      params.set("sortBy", "price");
      params.set("sortDescending", "true");
    } else if (value === "date_desc") {
      params.set("sortBy", "date");
      params.set("sortDescending", "true");
    }

    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 text-sm hidden sm:inline-block">Sort by:</span>
      
      {/* Backdrop for closing dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 cursor-default" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="relative z-40">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 font-semibold text-black dark:text-white py-1 focus:outline-none cursor-pointer text-sm sm:text-base select-none hover:opacity-80 transition-opacity"
        >
          <span>{activeOption.label}</span>
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg py-2 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  handleSelect(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                  currentValue === option.value 
                    ? "bg-gray-50 dark:bg-gray-800 font-bold text-black dark:text-white" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-black dark:hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
