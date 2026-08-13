"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export interface PromoCode {
  id: number;
  code: string;
  type: number | string; // 0 or "Percentage", 1 or "FixedAmount"
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  timesUsed: number;
  maxUsagePerUser?: number;
  isActive: boolean;
  createdAt: string;
}

export interface PromoCodeListResponse {
  success?: boolean;
  Success?: boolean;
  message?: string;
  Message?: string;
  data?: PromoCode[];
  Data?: PromoCode[];
}

export interface SinglePromoCodeResponse {
  success?: boolean;
  Success?: boolean;
  message?: string;
  Message?: string;
  data?: PromoCode;
  Data?: PromoCode;
  errors?: Record<string, string[]>;
  Errors?: Record<string, string[]>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7260";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Helper to get the auth header using the HTTP-Only cookie
async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value || cookieStore.get("token")?.value;
  
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function fetchPromoCodes(): Promise<PromoCodeListResponse> {
  const headers = await getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/api/PromoCode`, { 
    headers,
    next: { tags: ["promo-codes"] }
  });
  if (!response.ok) {
    try {
      return await response.json();
    } catch {
      return { success: false, message: `Failed to fetch promo codes (${response.status})`, data: [] };
    }
  }
  return response.json();
}

export async function getPromoCodeById(id: number | string): Promise<SinglePromoCodeResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/PromoCode/${id}`, { 
    headers,
    next: { tags: [`promo-code-${id}`, "promo-codes"] }
  });
  if (!response.ok) {
    try {
      return await response.json();
    } catch {
      return { success: false, message: `Failed to fetch promo code with ID: ${id}`, data: null as any };
    }
  }
  return response.json();
}

export async function createPromoCode(data: any) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/PromoCode`, {
    method: "POST",
    headers,
    body: JSON.stringify(data), 
  });
  
  if (response.ok) {
    revalidateTag("promo-codes");
  }
  try {
    return await response.json();
  } catch {
    return { success: false, message: `Server error ${response.status}` };
  }
}

export async function updatePromoCode(id: number | string, data: any) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/PromoCode/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data), 
  });
  
  if (response.ok) {
    revalidateTag("promo-codes");
    revalidateTag(`promo-code-${id}`);
  }
  try {
    return await response.json();
  } catch {
    return { success: false, message: `Server error ${response.status}` };
  }
}

export async function deletePromoCode(id: number | string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/PromoCode/${id}`, {
    method: "DELETE",
    headers,
  });
  
  if (response.ok) {
    revalidateTag("promo-codes");
    revalidateTag(`promo-code-${id}`);
  }
  try {
    return await response.json();
  } catch {
    return { success: false, message: `Server error ${response.status}` };
  }
}

export async function applyPromoCode(code: string, subtotal: number) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/PromoCode/apply`, {
    method: "POST",
    headers,
    body: JSON.stringify({ code, subtotal }), 
  });
  if (!response.ok) {
    try {
      const data = await response.json();
      return { status: response.status, ...data };
    } catch {
      return { success: false, message: `Server error ${response.status}`, status: response.status };
    }
  }
  return response.json();
}
