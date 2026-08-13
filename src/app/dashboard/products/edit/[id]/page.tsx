"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ProductForm from "@/components/products/ProductForm";

import { getProductById, Product } from "@/services/productService";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const result = await getProductById(id as string);
          if (result.success && result.data) {
            setProduct(result.data);
          } else {
            setError("Product not found.");
          }
        } catch (err) {
          console.error("Error fetching product:", err);
          setError("Failed to fetch product details.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Edit Product" />
      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          Loading product...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-500">
          {error}
        </div>
      ) : (
        <ProductForm productToEdit={product} />
      )}
    </div>
  );
}
