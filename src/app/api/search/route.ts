import { NextResponse } from "next/server";
import { fetchProducts } from "@/services/productService";
import * as categoryService from "@/services/categoryService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ products: [], categories: [] });
  }

  try {
    // Fetch products and categories in parallel
    const [productsRes, categoriesRes] = await Promise.all([
      fetchProducts(1, 5, query), // Fetch first 5 matching products
      categoryService.fetchCategories(1, 10, query) // Fetch first 10 matching categories
    ]);

    const products = productsRes.success ? productsRes.data.items : [];
    const categories = categoriesRes.success ? categoriesRes.data.items : [];

    return NextResponse.json({ products, categories });
  } catch (error) {
    console.error("Instant search route error:", error);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
