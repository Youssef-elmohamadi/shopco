"use client";

import React, { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Input from "@/components/form/input/InputField";
import Image from "next/image";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";

import { fetchProducts, deleteProduct, Product } from "@/services/productService";
import { getClientCache, setClientCache, clearClientCache } from "@/utils/clientCache";
import { getImageUrl } from "@/utils/apiConfig";

export default function ProductManager() {
  const itemsPerPage = 5;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");

  const cacheKey = `products_p${currentPage}_s${searchName}`;
  const initialCachedData = getClientCache<any>(cacheKey);

  const [products, setProducts] = useState<Product[]>(initialCachedData?.items || []);
  const [totalPages, setTotalPages] = useState<number>(initialCachedData?.totalPages || 1);
  const [totalItems, setTotalItems] = useState<number>(initialCachedData?.totalCount || 0);
  const [isLoading, setIsLoading] = useState<boolean>(!initialCachedData);

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProducts = useCallback(async (page = 1, search = "") => {
    const key = `products_p${page}_s${search}`;
    const cached = getClientCache<any>(key);

    if (!cached) {
      setIsLoading(true);
    }

    try {
      const result = await fetchProducts(page, itemsPerPage, search);
      const isSuccess = Boolean(result && (result.success || (result as any).Success));
      
      if (isSuccess && result.data) {
        setProducts(result.data.items || []);
        setTotalPages(result.data.totalPages || 1);
        setTotalItems(result.data.totalCount || 0); // Note: backend uses totalCount
        setClientCache(key, result.data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  }, [itemsPerPage]);

  // Fetch products cleanly on page change or debounced search change
  useEffect(() => {
    // If searchName is empty, fetch immediately without delay
    if (!searchName) {
      loadProducts(currentPage, "");
      return;
    }

    // Debounce search requests by 500ms when user is typing
    const timer = setTimeout(() => {
      loadProducts(currentPage, searchName);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentPage, searchName, loadProducts]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const confirmDelete = (id: number) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteProduct(productToDelete);
      const isSuccess = Boolean(result && (result.success || result.Success));

      if (isSuccess) {
        clearClientCache("products_");
        setIsDeleteModalOpen(false);
        const targetPage = products.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
        if (targetPage !== currentPage) {
          setCurrentPage(targetPage);
        } else {
          loadProducts(currentPage, searchName);
        }
      } else {
        alert(result?.message || result?.Message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred");
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
          Search
        </h3>
        <div className="flex max-w-sm flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            All Products
          </h3>
          <Link href="/dashboard/products/create">
            <Button startIcon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 3.75V14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.75 9H14.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}>
              Add New Product
            </Button>
          </Link>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader className="border-b border-gray-100 bg-brand-50 dark:border-white/[0.05] dark:bg-brand-500/10">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-800 dark:text-gray-200">
                    ID
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-800 dark:text-gray-200">
                    Image
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-800 dark:text-gray-200">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-800 dark:text-gray-200">
                    Price
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-800 dark:text-gray-200">
                    Stock
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-800 dark:text-gray-200">
                    Category
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-center font-medium text-gray-800 dark:text-gray-200">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-gray-500">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => {
                    // Use the first image as thumbnail if exists
                    const firstImage = product.images && product.images.length > 0 ? product.images[0].url : null;
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="px-5 py-4 text-start">
                          {product.id}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <div className="relative h-12 w-12 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                            {firstImage ? (
                              <Image
                                src={getImageUrl(firstImage)}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400 dark:bg-gray-800">
                                No Img
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white/90">
                          {product.name}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                          {product.discountPrice > 0 && product.discountPrice < product.price ? (
                            <div>
                              <span className="font-semibold text-gray-800 dark:text-white">${product.discountPrice}</span>
                              <span className="text-xs text-error-500 line-through block">${product.price}</span>
                            </div>
                          ) : (
                            <span>${product.price}</span>
                          )}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                          {product.stock}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                          {product.category?.name || product.categoryId}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Link
                              href={`/dashboard/products/show/${product.id}`}
                              className="flex items-center gap-1 rounded bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              View
                            </Link>
                            <Link
                              href={`/dashboard/products/edit/${product.id}`}
                              className="flex items-center gap-1 rounded bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-500 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Edit
                            </Link>
                            <button
                              onClick={() => confirmDelete(product.id)}
                              className="flex items-center gap-1 rounded bg-error-50 px-3 py-1.5 text-xs font-medium text-error-500 hover:bg-error-100 dark:bg-error-500/10 dark:hover:bg-error-500/20"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Delete
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-gray-100 p-5 dark:border-white/[0.05]">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
          </p>
          <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.25 13.5L6.75 9L11.25 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-brand-500 text-white"
                        : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.75 4.5L11.25 9L6.75 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)} 
        className="max-w-[400px] p-6 text-center"
      >
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error-50 text-error-500 dark:bg-error-500/10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16.01L12.01 15.9989" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">Delete Product</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Are you absolutely sure you want to delete this product? This action cannot be undone.
          </p>
        </div>
        <div className="flex w-full gap-3">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setIsDeleteModalOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            className="w-full bg-error-500 text-white hover:bg-error-600 focus:ring-error-500" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Yes, Delete it"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

