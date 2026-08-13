"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export interface Brand {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandResponse {
  success: boolean;
  data: Brand[];
  message?: string;
}

export interface SingleBrandResponse {
  success: boolean;
  data: Brand;
  message?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7260";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function getAuthHeaders(isFormData = false): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value || cookieStore.get("token")?.value;
  
  const headers: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

export async function fetchBrands(): Promise<BrandResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/Brand`, { 
    headers,
    next: { tags: ["brands"] }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch brands`);
  }
  return response.json();
}

export async function getBrandById(id: number | string): Promise<SingleBrandResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/Brand/${id}`, { 
    headers,
    next: { tags: [`brand-${id}`, "brands"] }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch brand with ID: ${id}`);
  }
  return response.json();
}

export async function createBrand(formData: FormData) {
  const headers = await getAuthHeaders(true); // true for FormData
  const response = await fetch(`${API_BASE_URL}/api/Brand`, {
    method: "POST",
    headers,
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create brand");
  }
  
  revalidateTag("brands");
  return response.json();
}

export async function updateBrand(id: number | string, formData: FormData) {
  const headers = await getAuthHeaders(true); // true for FormData
  const response = await fetch(`${API_BASE_URL}/api/Brand/${id}`, {
    method: "PUT",
    headers,
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update brand");
  }
  
  revalidateTag("brands");
  revalidateTag(`brand-${id}`);
  return response.json();
}

export async function deleteBrand(id: number | string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/Brand/${id}`, {
    method: "DELETE",
    headers,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete brand");
  }
  
  revalidateTag("brands");
  revalidateTag(`brand-${id}`);
  return response.json();
}
