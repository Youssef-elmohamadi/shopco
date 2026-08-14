"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import { Role } from "./roleService";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roles?: Role[];
  
  // Profile Fields
  phone?: string;
  bio?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedInUrl?: string;
  instagramUrl?: string;
  country?: string;
  cityState?: string;
  postalCode?: string;
  taxId?: string;
  imageUrl?: string;

  createdAt: string;
  updatedAt: string;
}

export interface ArrayUserResponse {
  success: boolean;
  message: string;
  data: User[];
  errors?: Record<string, string[]>;
}

export interface SingleUserResponse {
  success: boolean;
  message: string;
  data: User;
  errors?: Record<string, string[]>;
}

export interface BaseResponse {
  success: boolean;
  message: string;
  data: any;
  errors?: Record<string, string[]>;
}

import { getApiUrl } from "@/utils/apiConfig";

const getUserApiUrl = () => `${getApiUrl()}/User`;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function getAuthHeaders(isAdminApp: boolean = true): Promise<HeadersInit> {
  const cookieStore = await cookies();
  let token = cookieStore.get("token")?.value;
  if (isAdminApp) {
    token = cookieStore.get("admin_token")?.value || token;
  }
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token && token !== "undefined") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export async function fetchUsers(): Promise<ArrayUserResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getUserApiUrl()}`, { 
      headers, 
      cache: "no-store",
      next: { tags: ["users"] } 
    });
    
    if (!response.ok) {
      return { success: false, message: "Failed to fetch users", data: [] };
    }
    return await response.json();
  } catch (error) {
    console.error("Error in fetchUsers:", error);
    return { success: false, message: "Network error fetching users", data: [] };
  }
}

export async function getUserById(id: number | string): Promise<SingleUserResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getUserApiUrl()}/${id}`, { 
      headers, 
      cache: "no-store",
      next: { tags: [`user-${id}`, "users"] } 
    });
    
    if (!response.ok) {
      return { success: false, message: `Failed to fetch user ${id}`, data: null as any };
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getUserById:", error);
    return { success: false, message: `Network error fetching user ${id}`, data: null as any };
  }
}

export async function createUser(data: any): Promise<SingleUserResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${getUserApiUrl()}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data), 
  });
  
  if (response.ok) {
    revalidateTag("users");
  }
  return response.json();
}

export async function updateUser(id: number | string, data: any): Promise<SingleUserResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${getUserApiUrl()}/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data), 
  });
  
  if (response.ok) {
    revalidateTag("users");
    revalidateTag(`user-${id}`);
  }
  return response.json();
}

export async function deleteUser(id: number | string): Promise<BaseResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${getUserApiUrl()}/${id}`, {
    method: "DELETE",
    headers,
  });
  
  if (response.ok) {
    revalidateTag("users");
    revalidateTag(`user-${id}`);
  }
  return response.json();
}

export async function assignRoleToUser(userId: number | string, roleId: number): Promise<BaseResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${getUserApiUrl()}/${userId}/roles`, {
    method: "POST",
    headers,
    body: JSON.stringify({ roleId }),
  });
  
  if (response.ok) {
    revalidateTag("users");
    revalidateTag(`user-${userId}`);
  }
  return response.json();
}

export async function removeRoleFromUser(userId: number | string, roleId: number): Promise<BaseResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${getUserApiUrl()}/${userId}/roles/${roleId}`, {
    method: "DELETE",
    headers,
  });
  
  if (response.ok) {
    revalidateTag("users");
    revalidateTag(`user-${userId}`);
  }
  return response.json();
}

export async function getProfile(isAdminApp: boolean = true): Promise<SingleUserResponse> {
  const headers = await getAuthHeaders(isAdminApp);
  const response = await fetch(`${getUserApiUrl()}/profile`, { headers, cache: 'no-store' });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch profile`);
  }
  return response.json();
}

export async function updateProfile(data: any, isAdminApp: boolean = true): Promise<SingleUserResponse> {
  const cookieStore = await cookies();
  let token = cookieStore.get("token")?.value;
  if (isAdminApp) {
    token = cookieStore.get("admin_token")?.value || token;
  }
  
  const isFormData = data instanceof FormData;
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${getUserApiUrl()}/profile`, {
    method: "PUT",
    headers,
    body: isFormData ? data : JSON.stringify(data), 
  });
  return response.json();
}

