"use server";

import { cookies } from "next/headers";

export interface Permission {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface ArrayRoleResponse {
  success: boolean;
  message: string;
  data: Role[];
  errors?: Record<string, string[]>;
}

export interface SingleRoleResponse {
  success: boolean;
  message: string;
  data: Role;
  errors?: Record<string, string[]>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://www.shopco.somee.com";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value || cookieStore.get("token")?.value;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token && token !== "undefined") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export async function fetchRoles(): Promise<ArrayRoleResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/Role`, { headers, cache: 'no-store' });
    
    if (!response.ok) {
      return { success: false, message: "Failed to fetch roles", data: [] };
    }
    return await response.json();
  } catch (error) {
    console.error("Error in fetchRoles:", error);
    return { success: false, message: "Network error fetching roles", data: [] };
  }
}

export async function getRoleById(id: number | string): Promise<SingleRoleResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/Role/${id}`, { headers, cache: 'no-store' });
    
    if (!response.ok) {
      return { success: false, message: `Failed to fetch role ${id}`, data: null as any };
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getRoleById:", error);
    return { success: false, message: `Network error fetching role ${id}`, data: null as any };
  }
}

export async function createRole(data: { name: string; description?: string; permissionIds?: number[] }) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/Role`, {
    method: "POST",
    headers,
    body: JSON.stringify(data), 
  });
  return response.json();
}

export async function updateRole(id: number | string, data: { name: string; description?: string; permissionIds?: number[] }) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/Role/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data), 
  });
  return response.json();
}

export async function deleteRole(id: number | string) {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/Role/${id}`, {
    method: "DELETE",
    headers,
  });
  return response.json();
}

// Helper to fetch permissions if available, used by RoleForm
export async function fetchPermissions() {
  const headers = await getAuthHeaders();
  try {
    const response = await fetch(`${API_BASE_URL}/api/Permission`, { headers, cache: 'no-store' });
    if (response.ok) {
      return response.json();
    }
    return { success: false, data: [] };
  } catch {
    return { success: false, data: [] };
  }
}

