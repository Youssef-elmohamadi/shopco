"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function Pagination({ currentPage, totalPages, hasNextPage, hasPreviousPage }: PaginationProps) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `/shop?${params.toString()}`;
  };

  // Generate page numbers to show (e.g. 1 2 3 ... 8 9 10)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-8">
      <Link 
        href={hasPreviousPage ? createPageURL(currentPage - 1) : "#"}
        className={`flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium transition-colors ${
          hasPreviousPage ? "text-black hover:bg-gray-50" : "text-gray-300 pointer-events-none"
        }`}
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Previous</span>
      </Link>

      <div className="flex items-center gap-1 sm:gap-2">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>;
          }

          const isCurrentPage = page === currentPage;
          return (
            <Link
              key={page}
              href={createPageURL(page)}
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                isCurrentPage 
                  ? "bg-black text-white" 
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      <Link 
        href={hasNextPage ? createPageURL(currentPage + 1) : "#"}
        className={`flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium transition-colors ${
          hasNextPage ? "text-black hover:bg-gray-50" : "text-gray-300 pointer-events-none"
        }`}
      >
        <span className="hidden sm:inline">Next</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
