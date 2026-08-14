"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Image from "next/image";

import * as categoryService from "@/services/categoryService";
import { Category } from "@/services/categoryService";
import { getImageUrl } from "@/utils/apiConfig";

export default function ShowCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const result = await categoryService.getCategoryById(id as string);
          if (result.success && result.data) {
            setCategory(result.data);
          } else {
            setError("Category not found.");
          }
        } catch (err) {
          console.error("Error fetching category:", err);
          setError("Failed to fetch category details.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchCategory();
    }
  }, [id]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Category Details" />
      
      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          Loading category...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-500">
          {error}
        </div>
      ) : category ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              {category.imageUrl ? (
                <Image
                  src={getImageUrl(category.imageUrl)}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500 dark:bg-gray-800">
                  No Image
                </div>
              )}
            </div>
            
            <div className="flex flex-col justify-center gap-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h2>
                <p className="text-xl font-semibold text-gray-800 dark:text-white/90">{category.name}</p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h2>
                <p className="text-base text-gray-800 dark:text-gray-300">
                  {category.description || "No description provided."}
                </p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h2>
                <p className="text-base text-gray-800 dark:text-gray-300">
                  {new Date(category.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex gap-3 border-t border-gray-100 pt-6 dark:border-white/[0.05]">
            <Button onClick={() => router.push(`/dashboard/categories/edit/${category.id}`)}>
              Edit Category
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard/categories")}>
              Back to List
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
