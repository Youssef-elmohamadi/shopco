import React from "react";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { fetchProducts } from "@/services/productService";
import * as categoryService from "@/services/categoryService";
import ProductCard from "@/components/storefront/ProductCard";
import ShopSidebar from "@/components/storefront/ShopSidebar";
import SortDropdown from "@/components/storefront/SortDropdown";
import Pagination from "@/components/storefront/Pagination";
import MobileFilterWrapper from "@/components/storefront/MobileFilterWrapper";


export const metadata = {
  title: "Shop",
};


export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page) : 1;
  const categoryId = typeof resolvedSearchParams.categoryId === "string" ? parseInt(resolvedSearchParams.categoryId) : undefined;
  const minPrice = typeof resolvedSearchParams.minPrice === "string" ? parseInt(resolvedSearchParams.minPrice) : undefined;
  const maxPrice = typeof resolvedSearchParams.maxPrice === "string" ? parseInt(resolvedSearchParams.maxPrice) : undefined;
  const sortBy = typeof resolvedSearchParams.sortBy === "string" ? resolvedSearchParams.sortBy : undefined;
  const sortDescending = resolvedSearchParams.sortDescending === "true";
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : "";

  // Fetch data
  const categoriesRes = await categoryService.fetchCategories(1, 100);
  const categories = categoriesRes.success ? categoriesRes.data.items : [];

  const productsRes = await fetchProducts(
    page,
    9, // Page Size
    search,
    categoryId,
    minPrice,
    maxPrice,
    sortBy,
    sortDescending
  );

  const products = productsRes.success ? productsRes.data.items : [];
  const totalCount = productsRes.success ? (productsRes.data.totalItems ?? productsRes.data.totalCount ?? 0) : 0;
  const totalPages = productsRes.success ? (productsRes.data.totalPages ?? 0) : 0;
  const hasNextPage = productsRes.success ? (productsRes.data.hasNextPage ?? (page < totalPages)) : false;
  const hasPreviousPage = productsRes.success ? (productsRes.data.hasPreviousPage ?? (page > 1)) : false;

  // Find active category name for title
  const activeCategory = categoryId ? categories.find(c => c.id === categoryId) : null;
  let title = activeCategory ? activeCategory.name : "All Products";
  if (search) {
    title = `Search Results for "${search}"`;
  }

  return (
    <div className="bg-white min-h-screen pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-black">Home</Link>
          <ChevronRight size={14} />
          <span className="text-black font-medium">Shop</span>
          {activeCategory && (
            <>
              <ChevronRight size={14} />
              <span className="text-black font-medium">{activeCategory.name}</span>
            </>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-1/4 flex-shrink-0 sticky top-6 self-start">
            <ShopSidebar categories={categories} />
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            
            {/* Header: Title and Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 capitalize">{title}</h1>
              
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <p className="text-gray-500 text-sm hidden sm:block">
                  Showing {products.length > 0 ? (page - 1) * 9 + 1 : 0}-{Math.min(page * 9, totalCount)} of {totalCount} Products
                </p>
                <div className="flex items-center gap-3">
                  <SortDropdown />
                  
                  {/* Mobile Filter Toggle */}
                  <div className="lg:hidden">
                    <MobileFilterWrapper categories={categories} />
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-sm sm:hidden mt-[-8px]">
                Showing {products.length > 0 ? (page - 1) * 9 + 1 : 0}-{Math.min(page * 9, totalCount)} of {totalCount} Products
              </p>
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-gray-50 rounded-2xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
                <Link href="/shop" className="inline-block mt-4 text-black font-medium hover:underline">
                  Clear all filters
                </Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                hasNextPage={hasNextPage} 
                hasPreviousPage={hasPreviousPage} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
