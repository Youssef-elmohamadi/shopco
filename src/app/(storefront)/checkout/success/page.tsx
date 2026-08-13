"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Calendar, ShoppingBag } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const isSimulated = searchParams.get("simulated") === "true";

  // Estimated delivery date (3 to 5 business days from now)
  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const minDays = 3;
    const maxDays = 5;
    
    const deliveryMin = new Date(today);
    deliveryMin.setDate(today.getDate() + minDays);
    
    const deliveryMax = new Date(today);
    deliveryMax.setDate(today.getDate() + maxDays);
    
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
    return `${deliveryMin.toLocaleDateString("en-US", options)} - ${deliveryMax.toLocaleDateString("en-US", options)}`;
  };

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen py-16 sm:py-24 text-black dark:text-white flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4 text-center">
        
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-full border border-green-200 dark:border-green-800">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-3">
          Order Confirmed!
        </h1>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-md mx-auto mb-8">
          Thank you for shopping with us. Your order has been placed and is currently being processed.
        </p>

        {/* Details Card */}
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-6 mb-8 text-left space-y-4">
          <div className="flex justify-between items-baseline border-b border-gray-150 dark:border-gray-850 pb-3">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Order Reference</span>
            <span className="font-extrabold text-sm sm:text-base text-black dark:text-white">#{orderId || "N/A"}</span>
          </div>

          <div className="flex justify-between items-baseline border-b border-gray-150 dark:border-gray-850 pb-3">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Shipping Method</span>
            <span className="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300">Standard Delivery</span>
          </div>

          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase flex items-center gap-1.5 pt-0.5">
              <Calendar className="w-3.5 h-3.5 text-gray-400" /> Est. Delivery
            </span>
            <span className="font-extrabold text-xs sm:text-sm text-green-600 dark:text-green-400 text-right">
              {getEstimatedDeliveryDate()}
            </span>
          </div>
        </div>

        {isSimulated && (
          <div className="mb-8 p-3.5 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900 rounded-2xl text-xs font-semibold">
            Note: Simulated checkout successful (Server was offline/unreachable).
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-750 text-black dark:text-white rounded-full px-8 py-3.5 text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
          
          <Link
            href="/profile/orders"
            className="bg-black hover:bg-gray-900 dark:bg-white dark:hover:bg-gray-50 text-white dark:text-black rounded-full px-8 py-3.5 text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer"
          >
            Track Orders <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="bg-white dark:bg-gray-950 min-h-screen flex items-center justify-center text-gray-500 text-sm">
        Loading confirmation...
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
