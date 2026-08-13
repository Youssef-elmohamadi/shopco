"use client";

import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { toggleWishlist, checkWishlist } from '@/services/wishlistService';
import { useRouter } from 'next/navigation';

interface WishlistButtonProps {
  productId: number;
  className?: string;
  size?: number;
}

export default function WishlistButton({ productId, className = "", size = 20 }: WishlistButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await checkWishlist(productId);
        setIsFavorited(status);
      } catch (error) {
        // Not logged in or error
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [productId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if wrapped in a Link
    e.stopPropagation();

    if (loading) return;

    // Optimistic UI update
    const previousState = isFavorited;
    setIsFavorited(!isFavorited);

    try {
      const response = await toggleWishlist(productId);
      setIsFavorited(response.isFavorited);
    } catch (error: any) {
      // Revert if error
      setIsFavorited(previousState);
      
      if (error.message === "Unauthorized") {
        router.push("/signin");
      }
    }
  };

  if (loading) {
    return (
      <button 
        className={`flex items-center justify-center p-2 rounded-full bg-white shadow-sm border border-gray-100 text-gray-300 ${className}`}
        disabled
      >
        <Heart size={size} />
      </button>
    );
  }

  return (
    <button 
      onClick={handleToggle}
      className={`flex items-center justify-center p-2 rounded-full bg-white shadow-sm hover:scale-110 transition-transform duration-200 border border-gray-100 dark:bg-gray-800 dark:border-gray-700 ${
        isFavorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
      } ${className}`}
      aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart size={size} fill={isFavorited ? "currentColor" : "none"} />
    </button>
  );
}
