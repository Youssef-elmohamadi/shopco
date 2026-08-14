"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Image from "next/image";

import { getProductById, Product } from "@/services/productService";
import { getImageUrl } from "@/utils/apiConfig";

export default function ShowProductPage() {
  const params = useParams();
  const router = useRouter();
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
      <PageBreadcrumb pageTitle="Product Details" />
      
      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
          Loading product...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-error-200 bg-error-50 p-6 text-error-500">
          {error}
        </div>
      ) : product ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="flex flex-col gap-8 lg:flex-row">
            
            {/* Image Gallery */}
            <div className="flex w-full shrink-0 flex-col gap-4 lg:w-1/3">
              {product.images && product.images.length > 0 ? (
                <>
                  <div className="relative h-64 w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                    <Image
                      src={getImageUrl(product.images[0].url)}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {product.images.length > 1 && (
                    <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                      {product.images.slice(1).map((img, idx) => (
                        <div key={idx} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                          <Image
                            src={getImageUrl(img.url)}
                            alt={`${product.name} ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-800">
                  No Images
                </div>
              )}
            </div>
            
            {/* Details */}
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h2>
                <p className="text-2xl font-semibold text-gray-800 dark:text-white/90">{product.name}</p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</h2>
                <div className="flex items-center gap-3">
                  {product.discountPrice > 0 && product.discountPrice < product.price ? (
                    <>
                      <p className="text-xl font-bold text-brand-500">${product.discountPrice}</p>
                      <p className="text-sm font-medium text-error-500 line-through">${product.price}</p>
                    </>
                  ) : (
                    <p className="text-xl font-bold text-brand-500">${product.price}</p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Stock</h2>
                <p className="text-base text-gray-800 dark:text-gray-300">
                  {product.stock} units available
                </p>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h2>
                <p className="text-base text-gray-800 dark:text-gray-300">
                  {product.category?.name || `Category ID: ${product.categoryId}`}
                </p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h2>
                <p className="whitespace-pre-wrap text-base text-gray-800 dark:text-gray-300">
                  {product.description || "No description provided."}
                </p>
              </div>
              
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h2>
                <p className="text-base text-gray-800 dark:text-gray-300">
                  {new Date(product.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex gap-3 border-t border-gray-100 pt-6 dark:border-white/[0.05]">
            <Button onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}>
              Edit Product
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard/products")}>
              Back to List
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
