"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2 } from "lucide-react";
import { getMyWishlist, toggleWishlist, WishlistItem } from "@/services/wishlistService";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://www.shopco.somee.com";

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const data = await getMyWishlist();
      setItems(data || []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load your favorites.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: number) => {
    try {
      // Optimistic remove
      setItems(items.filter(item => item.productId !== productId));
      await toggleWishlist(productId);
    } catch (err) {
      console.error("Failed to remove item", err);
      // Revert if error
      fetchWishlist();
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center text-gray-500 dark:bg-gray-800 dark:border-gray-700">
        Loading your favorites...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center text-red-500 dark:bg-gray-800 dark:border-gray-700">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">My Favorites</h2>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 dark:bg-red-900/30">
            <Heart size={32} className="text-red-300 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Save items you love here to easily find them later.</p>
          <Link href="/shop" className="inline-block px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-100">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const hasDiscount = item.product.discountPrice != null && item.product.discountPrice < item.product.price;
            
            return (
              <div key={item.productId} className="group flex flex-col h-full border border-gray-200/60 rounded-3xl p-3 hover:shadow-sm transition-shadow dark:border-gray-700">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F0EEED] mb-3">
                  <button 
                    onClick={() => handleRemove(item.productId)}
                    className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                  
                  {hasDiscount && (
                    <div className="absolute top-3 left-3 z-10 bg-[#FF3333] text-white text-xs font-bold px-3 py-1 rounded-full">
                      -{Math.round(((item.product.price - item.product.discountPrice!) / item.product.price) * 100)}%
                    </div>
                  )}
                  
                  <Link href={`/product/${item.productId}`}>
                    {item.product.imageUrl ? (
                      <Image 
                        src={API_URL + item.product.imageUrl} 
                        alt={item.product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                  </Link>
                </div>
                
                <div className="flex flex-col flex-grow px-1">
                  <Link href={`/product/${item.productId}`} className="text-lg font-bold text-black truncate mb-1 dark:text-white hover:underline">
                    {item.product.name}
                  </Link>
                  
                  <div className="mt-auto pt-2 flex items-center gap-3">
                    <span className="text-xl font-bold text-black dark:text-white">
                      EGP {hasDiscount ? item.product.discountPrice : item.product.price}
                    </span>
                    {hasDiscount && (
                      <span className="text-xl font-bold text-gray-400 line-through">
                        EGP {item.product.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

