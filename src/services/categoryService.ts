"use server";

import { revalidateTag } from "next/cache";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface PagedCategoryResponse {
  success: boolean;
  message: string;
  data: {
    items: Category[];
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface SingleCategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7260";

/**
 * Fetch a paginated list of categories
 */
export async function fetchCategories(page: number = 1, pageSize: number = 5, searchName: string = ""): Promise<PagedCategoryResponse> {
  const url = new URL(`${API_BASE_URL}/api/Category`);
  url.searchParams.append("pageNumber", page.toString());
  url.searchParams.append("pageSize", pageSize.toString());
  if (searchName) {
    url.searchParams.append("searchName", searchName);
  }

  const response = await fetch(url.toString(), {
    next: { tags: ["categories"] }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

/**
 * Fetch a single category by ID
 */
export async function getCategoryById(id: number | string): Promise<SingleCategoryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/Category/${id}`, {
    next: { tags: [`category-${id}`, "categories"] }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch category with ID: ${id}`);
  }
  return response.json();
}

/**
 * Create a new category using FormData
 */
export async function createCategory(formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/api/Category`, {
    method: "POST",
    body: formData,
  });
  
  if (response.ok) {
    revalidateTag("categories");
    return response.json();
  }

  try {
    return await response.json();
  } catch {
    return { success: false, message: `Server error (${response.status})` };
  }
}

/**
 * Update an existing category using FormData
 */
export async function updateCategory(id: number | string, formData: FormData) {
  const response = await fetch(`${API_BASE_URL}/api/Category/${id}`, {
    method: "PUT",
    body: formData,
  });
  
  if (response.ok) {
    revalidateTag("categories");
    revalidateTag(`category-${id}`);
    return response.json();
  }

  try {
    return await response.json();
  } catch {
    return { success: false, message: `Server error (${response.status})` };
  }
}

/**
 * Delete a category by ID
 */
export async function deleteCategory(id: number | string) {
  const response = await fetch(`${API_BASE_URL}/api/Category/${id}`, {
    method: "DELETE",
  });
  
  if (response.ok) {
    revalidateTag("categories");
    revalidateTag(`category-${id}`);
  }
  return response.json();
}
