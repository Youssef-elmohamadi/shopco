"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import * as promoCodeService from "@/services/promoCodeService";

export interface CartItem {
  id: string; // Unique ID: e.g. `${productId}-${size}-${colorHex.replace('#', '')}`
  productId: number;
  variantId?: number;
  name: string;
  image: string;
  price: number; // Current selling price (could be discountPrice)
  originalPrice: number; // Original price before product discount
  size?: string;
  colorName?: string;
  colorHex?: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  originalSubtotal: number;
  discountAmount: number;
  promoCode: string;
  promoDiscount: number;
  deliveryFee: number;
  total: number;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message?: string; }>;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const DELIVERY_FEE = 15;
const FREE_DELIVERY_THRESHOLD = 1000;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string>("");
  const [promoDiscountAmount, setPromoDiscountAmount] = useState<number>(0);

  // Load cart from localStorage on mount safely (SSR safe)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("shop_co_cart");
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (e) {
          console.error("Failed to parse stored cart items", e);
        }
      }
      const storedPromo = localStorage.getItem("shop_co_promo");
      const storedPromoDiscount = localStorage.getItem("shop_co_promo_discount");
      if (storedPromo && storedPromoDiscount) {
        setPromoCode(storedPromo);
        setPromoDiscountAmount(Number(storedPromoDiscount));
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("shop_co_cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (newItem: Omit<CartItem, "quantity">, quantity: number) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === newItem.id);

      if (existingItemIndex > -1) {
        // Item exists, update quantity up to stock limit
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = Math.min(existingItem.stock, existingItem.quantity + quantity);
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };
        return updatedItems;
      } else {
        // Item doesn't exist, add it
        return [...prevItems, { ...newItem, quantity: Math.min(newItem.stock, quantity) }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const finalQuantity = Math.max(1, Math.min(item.stock, quantity));
          return { ...item, quantity: finalQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setPromoCode("");
    setPromoDiscountAmount(0);
    if (typeof window !== "undefined") {
      localStorage.removeItem("shop_co_cart");
      localStorage.removeItem("shop_co_promo");
      localStorage.removeItem("shop_co_promo_discount");
    }
  };

  const applyPromoCode = async (code: string): Promise<{ success: boolean; message?: string }> => {
    const formattedCode = code.trim().toUpperCase();
    try {
      let token = null;
      if (typeof document !== 'undefined') {
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(';').shift();
          return null;
        };
        token = getCookie("token") || getCookie("admin_token");
      }

      const result = await promoCodeService.applyPromoCode(formattedCode, subtotal);

      const isSuccess = Boolean(result && (result.success || result.Success));

      if (isSuccess) {
        setPromoCode(formattedCode);
        const discountAmount = result?.data?.discountAmount ?? result?.Data?.discountAmount ?? 0;
        setPromoDiscountAmount(discountAmount);
        if (typeof window !== "undefined") {
          localStorage.setItem("shop_co_promo", formattedCode);
          localStorage.setItem("shop_co_promo_discount", discountAmount.toString());
        }
        return { success: true };
      } else {
        // Backend returns an error message or HTTP error
        let errorMsg =
          result?.message ||
          result?.Message ||
          result?.detail ||
          result?.title ||
          (Array.isArray(result?.errors) ? result.errors[0] : null) ||
          "Invalid promo code";
        if (result?.status === 401 || String(errorMsg).includes("401")) errorMsg = "Please log in to apply promo codes.";
        return { success: false, message: errorMsg };
      }
    } catch (error) {
      console.error("Failed to apply promo code", error);
      return { success: false, message: "Network error while applying promo code" };
    }
  };

  const removePromoCode = () => {
    setPromoCode("");
    setPromoDiscountAmount(0);
    if (typeof window !== "undefined") {
      localStorage.removeItem("shop_co_promo");
      localStorage.removeItem("shop_co_promo_discount");
    }
  };

  // Calculations
  // originalSubtotal is based on originalPrice * qty
  const originalSubtotal = cartItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  
  // subtotal is based on current active selling price * qty
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // productDiscount is the difference between originalSubtotal and selling subtotal
  const discountAmount = originalSubtotal - subtotal;

  // Promo code discount is applied on top of the selling subtotal
  const promoDiscount = promoDiscountAmount;

  // Delivery fee is EGP 15, unless subtotal after product discount is greater than EGP 1000
  const deliveryFee = cartItems.length === 0 ? 0 : (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE);

  // Total
  const total = Math.max(0, subtotal - promoDiscount + deliveryFee);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        originalSubtotal,
        discountAmount,
        promoCode,
        promoDiscount,
        deliveryFee,
        total,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
