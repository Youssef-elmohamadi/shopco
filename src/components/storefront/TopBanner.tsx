"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface TopBannerProps {
  isLoggedIn: boolean;
  userName: string | null;
}

export default function TopBanner({ isLoggedIn, userName }: TopBannerProps) {
  const messages = isLoggedIn
    ? [
        `Welcome back, ${userName || "Valued Customer"}! Explore our latest products.`,
        "🎉 Free shipping on orders over 500 EGP!",
        "🔥 Check out our new arrivals in the shop section!"
      ]
    : [
        "Sign up and get 20% off to your first order. Sign Up Now",
        "🎉 Free shipping on orders over 500 EGP!",
        "✨ Discover the latest trends today!"
      ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="bg-black text-white text-xs sm:text-sm py-2.5 px-4 text-center overflow-hidden transition-all duration-300">
      <div
        className={`transition-opacity duration-500 ease-in-out ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {messages[currentIdx] === messages[0] && !isLoggedIn ? (
          <span>
            Sign up and get 20% off on your first order.{" "}
            <Link href="/signup" className="underline font-bold hover:text-gray-300">
              Sign Up Now
            </Link>
          </span>
        ) : (
          <span className="font-semibold tracking-wide">{messages[currentIdx]}</span>
        )}
      </div>
    </div>
  );
}
