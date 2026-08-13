"use client";

import React, { useState, useEffect } from "react";
import { ProductVariant } from "@/services/productService";
import { Star, StarHalf } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface ProductVariantSelectorProps {
  productId: number;
  productName: string;
  productImage: string;
  variants: ProductVariant[];
  basePrice: number;
  baseDiscountPrice: number;
  baseStock: number;
  averageRating?: number;
  description?: string;
}

export default function ProductVariantSelector({ 
  productId,
  productName,
  productImage,
  variants, 
  basePrice, 
  baseDiscountPrice, 
  baseStock,
  averageRating = 0,
  description = ""
}: ProductVariantSelectorProps) {
  const { addToCart } = useCart();

  // Extract unique sizes and colors
  const sizes = Array.from(new Set(variants.map(v => v.size).filter(Boolean)));
  const colors = Array.from(new Set(variants.map(v => v.colorHex).filter(Boolean)));

  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || "");
  const [quantity, setQuantity] = useState<number>(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Find the matched variant
  const matchedVariant = variants.find(v => 
    (!selectedSize || v.size === selectedSize) && 
    (!selectedColor || v.colorHex === selectedColor)
  ) || variants[0];

  const currentPrice = matchedVariant?.price || basePrice;
  const currentDiscountPrice = matchedVariant?.discountPrice || baseDiscountPrice;
  const currentStock = matchedVariant?.stock ?? baseStock;

  const numStars = Math.round(averageRating);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleAddToCart = () => {
    const itemPrice = currentDiscountPrice > 0 ? currentDiscountPrice : currentPrice;
    const itemOriginalPrice = currentPrice;
    
    // Construct a composite key to handle variant uniqueness in cart
    const colorPart = selectedColor ? selectedColor.replace("#", "") : "";
    const sizePart = selectedSize ? selectedSize : "";
    const cartItemId = `${productId}-${sizePart}-${colorPart}`;
    
    addToCart({
      id: cartItemId,
      productId: productId,
      variantId: matchedVariant?.id,
      name: productName,
      image: productImage,
      price: itemPrice,
      originalPrice: itemOriginalPrice,
      size: selectedSize || undefined,
      colorName: matchedVariant?.colorName || undefined,
      colorHex: selectedColor || undefined,
      stock: currentStock,
    }, quantity);

    setToastMessage(`Added ${quantity} x "${productName}" (${selectedSize || "N/A"}, ${matchedVariant?.colorName || "N/A"}) to cart.`);
    setShowToast(true);
  };

  return (
    <div className="flex flex-col mb-8 relative">
      
      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex text-[#FFC633]">
          {[1, 2, 3, 4, 5].map((star) => {
            if (star <= numStars) return <Star key={star} className="w-5 h-5 fill-current text-[#FFC633]" />;
            if (star - 0.5 === averageRating) return <StarHalf key={star} className="w-5 h-5 fill-current text-[#FFC633]" />;
            return <Star key={star} className="w-5 h-5 text-gray-300" />;
          })}
        </div>
        <span className="text-gray-500 text-sm">{averageRating > 0 ? `${averageRating.toFixed(1)}/5` : "0/5"}</span>
      </div>

      {/* Price Display */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xl font-bold text-black">{currentDiscountPrice > 0 ? currentDiscountPrice : currentPrice} <span className="text-sm">EGP</span></span>
        {currentDiscountPrice > 0 && currentDiscountPrice < currentPrice && (
          <>
            <span className="text-lg text-gray-400 line-through">{currentPrice} <span className="text-sm">EGP</span></span>
            <span className="bg-[#FF3333]/10 text-[#FF3333] px-3.5 py-1 rounded-full text-sm font-medium ml-1">
              -{Math.round((1 - currentDiscountPrice / currentPrice) * 100)}%
            </span>
          </>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-gray-500 font-normal leading-relaxed mb-6 border-b border-gray-200 pb-6">
          {description}
        </p>
      )}

      {/* Colors */}
      {colors.length > 0 && (
        <div className="flex flex-col gap-3 mb-6 border-b border-gray-200 pb-6">
          <span className="text-gray-500 font-normal">Select Colors</span>
          <div className="flex flex-wrap gap-3">
            {colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColor(color)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${selectedColor === color ? 'ring-1 ring-offset-2 ring-gray-900' : 'border border-gray-200 hover:border-gray-400'}`}
                style={{ backgroundColor: color }}
                title={variants.find(v => v.colorHex === color)?.colorName || color}
              >
                {selectedColor === color && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isLightColor(color) ? "black" : "white"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes.length > 0 && (
        <div className="flex flex-col gap-3 mb-6 border-b border-gray-200 pb-6">
          <span className="text-gray-500 font-normal">Choose Size</span>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSize(size)}
                className={`px-6 py-2.5 rounded-full font-normal transition-colors ${selectedSize === size ? 'bg-black text-white' : 'bg-[#F0F0F0] text-gray-500 hover:bg-gray-200'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to Cart Row */}
      <div className="flex items-center gap-4 pt-2">
        {/* Quantity Selector */}
        <div className="flex items-center justify-between bg-[#F0F0F0] rounded-full px-4 py-3.5 w-32 shrink-0">
          <button 
            className="text-gray-500 hover:text-black focus:outline-none"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          <span className="font-medium">{quantity}</span>
          <button 
            className="text-gray-500 hover:text-black focus:outline-none"
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            disabled={quantity >= currentStock}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className="flex-grow bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          disabled={currentStock <= 0}
        >
          {currentStock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
      
      {currentStock <= 5 && currentStock > 0 && (
        <div className="text-sm text-red-500 mt-2">
          Only {currentStock} left in stock!
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-black text-white dark:bg-white dark:text-black px-5 py-4 rounded-2xl shadow-xl border border-gray-800 dark:border-gray-200 flex items-center justify-between gap-4 animate-bounce">
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-sm tracking-tight text-white dark:text-black">Added to Cart!</span>
            <span className="text-[11px] text-gray-400 dark:text-gray-500 line-clamp-1">{toastMessage}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href="/cart"
              className="bg-white text-black dark:bg-black dark:text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              View Cart
            </Link>
            <button 
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-white dark:hover:text-black focus:outline-none p-1"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to determine checkmark color
function isLightColor(color: string) {
  const hex = color.replace('#', '');
  if (hex.length === 3 || hex.length === 6) {
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.substring(0, 2), 16);
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.substring(2, 4), 16);
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.substring(4, 6), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128);
  }
  return false;
}
