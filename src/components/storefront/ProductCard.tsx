import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/services/productService";
import { Star, StarHalf } from "lucide-react";
import WishlistButton from "./WishlistButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Use absolute URL for the image if it exists, otherwise a placeholder
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7260";
  const imageUrl = product.images && product.images.length > 0
    ? (product.images[0].url.startsWith('http') ? product.images[0].url : `${API_BASE_URL}${product.images[0].url}`)
    : "/images/placeholder.png";

  const hasDiscount = product.discountPrice > 0;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  
  // Calculate discount percentage
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  // Real rating from backend
  const rating = product.averageRating ? product.averageRating.toFixed(1) : "0.0";
  const numStars = Math.round(product.averageRating || 0);

  return (
    <div className="group flex flex-col h-full border border-gray-200/60 rounded-3xl p-3 hover:shadow-sm transition-shadow">
      <div className="flex flex-col flex-grow relative">
        <div className="absolute top-0 right-0 z-10">
          <WishlistButton productId={product.id} />
        </div>
        {/* Image Container */}
        <Link href={`/product/${product.id}`} className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F0EEED] mb-3 block">
          {hasDiscount && (
            <span className="absolute top-3 left-3 z-10 bg-black text-white text-xs font-bold px-3 py-1 rounded-full pointer-events-none">
              -{discountPercentage}%
            </span>
          )}
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>

        {/* Product Details */}
        <div className="flex flex-col flex-grow px-1">
          <Link href={`/product/${product.id}`}>
            <h3 className="text-lg font-bold text-black line-clamp-1 mb-1 capitalize tracking-tight cursor-pointer">
              {product.name}
            </h3>
          </Link>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-[#FFC633]">
              {[1, 2, 3, 4, 5].map((star) => {
                if (star <= numStars) return <Star key={star} className="w-4 h-4 fill-current text-[#FFC633]" />;
                if (star - 0.5 === product.averageRating) return <StarHalf key={star} className="w-4 h-4 fill-current text-[#FFC633]" />;
                return <Star key={star} className="w-4 h-4 text-gray-300" />;
              })}
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-auto mb-3">
            <span className="text-xl font-bold text-black">{currentPrice} <span className="text-xs">EGP</span></span>
            {hasDiscount && (
              <span className="text-sm font-bold text-gray-400 line-through">
                {product.price} <span className="text-xs">EGP</span>
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="w-full mt-auto px-1">
        <Link 
          href={`/product/${product.id}`}
          className="block w-full bg-[#0F172A] text-white text-center py-2.5 rounded-full font-medium hover:bg-black transition-colors text-sm"
        >
          Add to Cart
        </Link>
      </div>
    </div>
  );
}
