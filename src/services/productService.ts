"use server";

import { cookies } from "next/headers";

export interface Category {
  id: number;
  name: string;
}

export interface ProductVariant {
  id: number;
  size: string;
  colorName: string;
  colorHex: string;
  price: number;
  discountPrice: number;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  stock: number;
  averageRating: number;
  categoryId: number;
  category?: Category;
  brandId?: number;
  brand?: any;
  images: { id: number; url: string }[];
  variants?: ProductVariant[];
  reviews?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface PagedProductResponse {
  success: boolean;
  message: string;
  data: {
    items: Product[];
    totalCount?: number;
    totalItems?: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
}

export interface SingleProductResponse {
  success: boolean;
  message: string;
  data: Product;
  errors?: Record<string, string[]>;
}

import { revalidateTag } from "next/cache";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://www.shopco.somee.com";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Helper to get the auth header using the HTTP-Only cookie
async function getAuthHeaders(isFormData = false): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value || cookieStore.get("token")?.value;
  
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

export async function fetchProducts(
  page: number = 1, 
  pageSize: number = 9, 
  search: string = "", 
  categoryId?: number,
  minPrice?: number,
  maxPrice?: number,
  sortBy?: string,
  sortDescending?: boolean
): Promise<PagedProductResponse> {
  const url = new URL(`${API_BASE_URL}/api/Product`);
  url.searchParams.append("PageNumber", page.toString());
  url.searchParams.append("PageSize", pageSize.toString());
  if (search) url.searchParams.append("Search", search);
  if (categoryId) url.searchParams.append("CategoryId", categoryId.toString());
  if (minPrice !== undefined) url.searchParams.append("MinPrice", minPrice.toString());
  if (maxPrice !== undefined) url.searchParams.append("MaxPrice", maxPrice.toString());
  if (sortBy) url.searchParams.append("SortBy", sortBy);
  if (sortDescending !== undefined) url.searchParams.append("SortDescending", sortDescending.toString());

  const headers = await getAuthHeaders();
  
  const response = await fetch(url.toString(), { 
    headers,
    next: { tags: ["products"] }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return response.json();
}

export async function getProductById(id: number | string): Promise<SingleProductResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/Product/${id}`, { 
    headers,
    next: { tags: [`product-${id}`, "products"] }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch product with ID: ${id}`);
  }
  return response.json();
}

export async function createProduct(formData: FormData) {
  const headers = await getAuthHeaders(true);
  const response = await fetch(`${API_BASE_URL}/api/Product`, {
    method: "POST",
    headers,
    body: formData, 
  });
  
  if (response.ok) {
    revalidateTag("products");
  }
  return response.json();
}

export async function updateProduct(id: number | string, formData: FormData) {
  const headers = await getAuthHeaders(true);
  const response = await fetch(`${API_BASE_URL}/api/Product/${id}`, {
    method: "PUT",
    headers,
    body: formData, 
  });
  
  if (response.ok) {
    revalidateTag("products");
    revalidateTag(`product-${id}`);
  }
  return response.json();
}

export async function deleteProduct(id: number | string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/Product/${id}`, {
    method: "DELETE",
    headers,
  });
  
  if (response.ok) {
    revalidateTag("products");
    revalidateTag(`product-${id}`);
  }
  try {
    return await response.json();
  } catch {
    return { success: response.ok, status: response.status };
  }
}

