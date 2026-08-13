"use server";

import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://www.shopco.somee.com";

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token && token !== "undefined") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export interface WishlistItem {
  productId: number;
  createdAt: string;
  product: {
    id: number;
    name: string;
    price: number;
    discountPrice?: number;
    categoryName?: string;
    imageUrl?: string;
  };
}

export async function getMyWishlist(): Promise<WishlistItem[]> {
  try {
    const headers = await getAuthHeaders();
    const authHeader = headers as Record<string, string>;
    if (!authHeader.Authorization) {
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/api/Wishlist`, { headers, cache: 'no-store' });
    
    if (!response.ok) {
      return [];
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error in getMyWishlist:", error);
    return [];
  }
}

export async function toggleWishlist(productId: number | string): Promise<{ success: boolean; message: string; isFavorited: boolean }> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/Wishlist/toggle/${productId}`, { 
    method: 'POST',
    headers, 
    cache: 'no-store' 
  });
  
  if (!response.ok) {
    if (response.status === 401) {
       throw new Error("Unauthorized");
    }
    throw new Error("Failed to toggle wishlist");
  }
  
  return await response.json();
}

export async function checkWishlist(productId: number | string): Promise<boolean> {
  const headers = await getAuthHeaders();
  // Don't send request if not authenticated (token is empty or "Bearer undefined")
  const authHeader = headers as Record<string, string>;
  if (!authHeader.Authorization || authHeader.Authorization === "Bearer undefined" || authHeader.Authorization === "Bearer ") {
    return false;
  }

  const response = await fetch(`${API_BASE_URL}/api/Wishlist/check/${productId}`, { headers, cache: 'no-store' });
  
  if (!response.ok) {
    return false;
  }
  
  const result = await response.json();
  return result.isFavorited;
}

