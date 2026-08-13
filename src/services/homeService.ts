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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://www.shopco.somee.com";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function fetchHomeData(): Promise<HomeApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Home`, {
      cache: "no-store", 
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Failed to fetch home data",
        data: { latestProducts: [], categories: [], popularProducts: [] },
        errors: null
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchHomeData:", error);
    return {
      success: false,
      message: "Network error fetching home data",
      data: { latestProducts: [], categories: [], popularProducts: [] },
      errors: error
    };
  }
}

