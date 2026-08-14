"use server";

import { cookies } from "next/headers";

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  phoneNumber: string;
  shippingStreetAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZipCode: string;
  shippingCountry: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

export interface ArrayOrderResponse {
  success: boolean;
  message: string;
  data: Order[];
  errors?: Record<string, string[]>;
}

export interface SingleOrderResponse {
  success: boolean;
  message: string;
  data: Order;
  errors?: Record<string, string[]>;
}

export interface BaseResponse {
  success: boolean;
  message: string;
  data: any;
  errors?: Record<string, string[]>;
}

import { getApiUrl } from "@/utils/apiConfig";

const getOrderApiUrl = () => `${getApiUrl()}/Order`;
const getCartApiUrl = () => `${getApiUrl()}/Cart`;
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function getAuthHeaders(isAdminApp: boolean = true): Promise<HeadersInit> {
  const cookieStore = await cookies();
  let token = cookieStore.get("token")?.value;
  if (isAdminApp) {
    token = cookieStore.get("admin_token")?.value || token;
  }
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token && token !== "undefined") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export async function fetchAllOrders(): Promise<ArrayOrderResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${getOrderApiUrl()}/all`, { headers, cache: 'no-store' });
    
    if (!response.ok) {
      return { success: false, message: "Failed to fetch all orders", data: [] };
    }
    return await response.json();
  } catch (error) {
    console.error("Error in fetchAllOrders:", error);
    return { success: false, message: "Network error fetching orders", data: [] };
  }
}

export async function getMyOrders(isAdminApp: boolean = true): Promise<ArrayOrderResponse> {
  try {
    const headers = await getAuthHeaders(isAdminApp);
    const response = await fetch(`${getOrderApiUrl()}`, { headers, cache: 'no-store' });
    
    if (!response.ok) {
      return { success: false, message: "Failed to fetch orders", data: [] };
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getMyOrders:", error);
    return { success: false, message: "Network error fetching orders", data: [] };
  }
}

export async function getOrderById(id: number | string, isAdminApp: boolean = true): Promise<SingleOrderResponse> {
  try {
    const headers = await getAuthHeaders(isAdminApp);
    const response = await fetch(`${getOrderApiUrl()}/${id}`, { headers, cache: 'no-store' });
    
    if (!response.ok) {
      return { success: false, message: `Failed to fetch order ${id}`, data: null as any };
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getOrderById:", error);
    return { success: false, message: `Network error fetching order ${id}`, data: null as any };
  }
}

export async function changeOrderStatus(id: number | string, status: string): Promise<SingleOrderResponse> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${getOrderApiUrl()}/${id}/status`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ status }), 
  });
  
  if (!response.ok) {
    // Attempt to parse error from backend if possible
    try {
      const errorData = await response.json();
      return errorData;
    } catch {
      throw new Error(`Failed to update order status for ID: ${id}`);
    }
  }
  
  return response.json();
}

export async function createOrder(
  checkoutData: {
    phoneNumber: string;
    shippingStreetAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingZipCode: string;
    shippingCountry: string;
    paymentMethod: string;
    orderNotes?: string;
    promoCode?: string;
  },
  items: { productId: number; quantity: number }[],
  isAdminApp: boolean = false
): Promise<SingleOrderResponse> {
  const headers = await getAuthHeaders(isAdminApp);

  // 1. Clear any existing cart items in the database for the user
  try {
    await fetch(`${getCartApiUrl()}`, {
      method: "DELETE",
      headers,
    });
  } catch (err) {
    console.error("Error clearing DB cart:", err);
  }

  // 2. Add each frontend item to the database cart
  for (const item of items) {
    try {
      await fetch(`${getCartApiUrl()}/items`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          productId: item.productId,
          quantity: item.quantity,
        }),
      });
    } catch (err) {
      console.error(`Error adding product ${item.productId} to DB cart:`, err);
    }
  }

  // 3. Call C# checkout endpoint
  const formattedPaymentMethod = checkoutData.paymentMethod.replace(/\s+/g, ""); // e.g. "Cash on Delivery" -> "CashOnDelivery"

  const checkoutPayload = {
    phoneNumber: checkoutData.phoneNumber,
    shippingStreetAddress: checkoutData.shippingStreetAddress,
    shippingCity: checkoutData.shippingCity,
    shippingState: checkoutData.shippingState,
    shippingZipCode: checkoutData.shippingZipCode,
    shippingCountry: checkoutData.shippingCountry,
    paymentMethod: formattedPaymentMethod,
    orderNotes: checkoutData.orderNotes,
    promoCode: checkoutData.promoCode,
  };

  const response = await fetch(`${getOrderApiUrl()}/checkout`, {
    method: "POST",
    headers,
    body: JSON.stringify(checkoutPayload),
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      return errorData;
    } catch {
      throw new Error("Failed to create order on checkout");
    }
  }

  return response.json();
}

