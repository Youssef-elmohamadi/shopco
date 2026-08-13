import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/services/productService";

interface ProductSliderProps {
  products: Product[];
}

export default function ProductSlider({ products }: ProductSliderProps) {
  if (!products || products.length === 0) {
    return <p className="text-gray-500 text-center py-8">No products found.</p>;
  }

  return (
    <div className="relative w-full">
      <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 md:gap-6 pb-4">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="w-[280px] shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      {/* Hide scrollbar styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
