"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CategoryForm from "@/components/categories/CategoryForm";

import * as categoryService from "@/services/categoryService";
import { Category } from "@/services/categoryService";

export default function EditCategoryPage() {
  const params = useParams();
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
      <PageBreadcrumb pageTitle="Edit Category" />
      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          Loading category...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-500">
          {error}
        </div>
      ) : (
        <CategoryForm categoryToEdit={category} />
      )}
    </div>
  );
}
