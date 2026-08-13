"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    subtotal,
    originalSubtotal,
    discountAmount,
    promoCode,
    promoDiscount,
    deliveryFee,
    total,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess(false);

    if (!promoInput.trim()) {
      setPromoError("Please enter a promo code.");
      return;
    }

    const result = await applyPromoCode(promoInput);
    if (result.success) {
      setPromoSuccess(true);
      setPromoInput("");
    } else {
      setPromoError(result.message || "Invalid promo code.");
    }
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7260";

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 sm:mb-8">
          <Link href="/" className="hover:text-black dark:hover:text-white transition">Home</Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-black dark:text-white font-medium">Cart</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black dark:text-white mb-6 sm:mb-8">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 border border-gray-150 dark:border-gray-800 rounded-3xl p-8 bg-gray-50/50 dark:bg-gray-900/30">
            <div className="bg-[#F0EEED] dark:bg-gray-800 p-6 rounded-full mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mb-8 text-sm sm:text-base">
              Looks like you haven't added any products to your cart yet. Explore our shop to find something you like!
            </p>
            <Link
              href="/shop"
              className="bg-black dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-full text-sm font-bold hover:opacity-90 transition inline-flex items-center gap-2"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-7 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-4 sm:p-6 bg-white dark:bg-gray-900/40">
              <div className="flex flex-col gap-6">
                {cartItems.map((item, idx) => {
                  const imageUrl = item.image.startsWith("http") ? item.image : `${API_BASE_URL}${item.image}`;
                  
                  return (
                    <div key={item.id}>
                      <div className="flex gap-4 sm:gap-5 items-start relative">
                        {/* Item Image */}
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-[#F0EEED] dark:bg-gray-800 rounded-2xl overflow-hidden shrink-0">
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-grow min-w-0 pr-8">
                          <Link href={`/product/${item.productId}`} className="inline-block">
                            <h3 className="text-base sm:text-lg font-bold text-black dark:text-white truncate capitalize hover:underline">
                              {item.name}
                            </h3>
                          </Link>
                          
                          <div className="flex flex-col gap-1 mt-1 sm:mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                            {item.size && (
                              <span>
                                Size: <span className="text-gray-800 dark:text-gray-200">{item.size}</span>
                              </span>
                            )}
                            {item.colorName && (
                              <span className="flex items-center gap-1.5">
                                Color:{" "}
                                <span className="text-gray-800 dark:text-gray-200 capitalize">{item.colorName}</span>
                                {item.colorHex && (
                                  <span
                                    className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-700"
                                    style={{ backgroundColor: item.colorHex }}
                                    title={item.colorName}
                                  />
                                )}
                              </span>
                            )}
                          </div>

                          <div className="text-lg sm:text-xl font-bold text-black dark:text-white mt-3 sm:mt-4">
                            {item.price} EGP
                          </div>
                        </div>

                        {/* Trash Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="absolute top-0 right-0 text-red-500 hover:text-red-700 p-1.5 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        {/* Quantity Controls */}
                        <div className="absolute bottom-0 right-0 flex items-center justify-between bg-[#F0F0F0] dark:bg-gray-800 rounded-full px-3.5 py-2 w-28 shrink-0">
                          <button
                            className="text-gray-500 hover:text-black dark:hover:text-white focus:outline-none disabled:opacity-50"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-semibold text-sm text-black dark:text-white">{item.quantity}</span>
                          <button
                            className="text-gray-500 hover:text-black dark:hover:text-white focus:outline-none disabled:opacity-50"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Divider */}
                      {idx < cartItems.length - 1 && (
                        <div className="border-b border-gray-100 dark:border-gray-800/60 my-6" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 border border-gray-200/80 dark:border-gray-800 rounded-3xl p-5 sm:p-6 bg-white dark:bg-gray-900/40">
              <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="flex flex-col gap-4 text-sm sm:text-base mb-6">
                {/* Original Subtotal */}
                <div className="flex justify-between items-center text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-black dark:text-white">{originalSubtotal} EGP</span>
                </div>

                {/* Product Discount */}
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400">Product Discount</span>
                    <span className="font-bold text-red-500">-{discountAmount} EGP</span>
                  </div>
                )}

                {/* Promo Code Discount */}
                {promoDiscount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      Discount ({promoCode})
                    </span>
                    <span className="font-bold text-red-500">-{promoDiscount} EGP</span>
                  </div>
                )}

                {/* Delivery Fee */}
                <div className="flex justify-between items-center text-gray-500 dark:text-gray-400 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-black dark:text-white">
                    {deliveryFee > 0 ? `${deliveryFee} EGP` : "Free"}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center text-base sm:text-lg font-bold text-black dark:text-white pt-2">
                  <span>Total</span>
                  <span className="text-lg sm:text-xl font-extrabold">{total} EGP</span>
                </div>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-3 mb-6 relative">
                <div className="relative flex-grow">
                  <Tag className="absolute left-4 top-3.5 h-4.5 w-4.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Add promo code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#F0F0F0] dark:bg-gray-800 text-black dark:text-white border-none rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-black dark:bg-white text-white dark:text-black rounded-full px-6 py-3 text-sm font-bold hover:opacity-90 transition cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {/* Promo alerts */}
              {promoError && (
                <p className="text-xs text-red-500 mb-4 px-1">{promoError}</p>
              )}
              {promoSuccess && (
                <p className="text-xs text-green-600 dark:text-green-400 mb-4 px-1">Promo code applied successfully!</p>
              )}
              {promoCode && (
                <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 px-4 py-2.5 rounded-2xl mb-6 text-xs">
                  <span className="text-green-700 dark:text-green-400 font-medium">
                    Active Code: <span className="font-extrabold">{promoCode}</span>
                  </span>
                  <button
                    onClick={removePromoCode}
                    className="text-green-700 hover:text-red-500 dark:text-green-400 dark:hover:text-red-400 font-bold p-1 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full bg-black dark:bg-white text-white dark:text-black text-center py-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer shadow-md"
              >
                Go to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
