"use server";

import { cookies } from "next/headers";
import { Order } from "./orderService";

export interface MonthlyOrderStats {
  year: number;
  month: number;
  orderCount: number;
  revenue: number;
}

export interface DashboardStatistics {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyOrders: MonthlyOrderStats[];
  recentOrders: Order[];
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardStatistics;
  errors?: Record<string, string[]>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://www.shopco.somee.com";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function getAuthHeaders(): Promise<HeadersInit> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value || cookieStore.get("token")?.value;
  
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function fetchDashboardStatistics(): Promise<DashboardResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_BASE_URL}/api/Dashboard/statistics`, { 
    headers, 
    cache: 'no-store' 
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch dashboard statistics");
  }
  
  return response.json();
}

