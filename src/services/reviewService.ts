"use server";

import { cookies } from "next/headers";

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewResponse {
  success: boolean;
  data: Review[];
  message?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7260";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value || cookieStore.get("token")?.value;
  
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getProductReviews(productId: number | string): Promise<ReviewResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/Review/product/${productId}`, { 
    headers,
    cache: "no-store" 
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch reviews for product: ${productId}`);
  }
  return response.json();
}

export async function createReview(productId: number, rating: number, comment: string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/Review`, {
    method: "POST",
    headers,
    body: JSON.stringify({ productId, rating, comment }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create review");
  }
  
  return response.json();
}
