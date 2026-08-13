"use server";

import { Product } from "./productService";
import { Category } from "./categoryService";

export interface HomeData {
  latestProducts: Product[];
  categories: Category[];
  popularProducts: Product[];
}

export interface HomeApiResponse {
  success: boolean;
  message: string;
  data: HomeData;
  errors: any;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7260";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function fetchHomeData(): Promise<HomeApiResponse> {
  const response = await fetch(`${API_BASE_URL}/api/Home`, {
    cache: "no-store", 
  });

  if (!response.ok) {
    throw new Error("Failed to fetch home data");
  }

  return response.json();
}
