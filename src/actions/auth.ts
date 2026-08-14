"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Bypass SSL verification in development for local ASP.NET Core self-signed certificates
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

// Base URL for your ASP.NET Core API
import { getApiUrl } from "@/utils/apiConfig";
const getAuthApiUrl = () => `${getApiUrl()}/Auth`;

export type AuthState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function registerUser(prevState: AuthState, formData: FormData): Promise<AuthState> {
  // 1. Extract data from FormData
  const firstName = formData.get("fname")?.toString() || "";
  const lastName = formData.get("lname")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const confirmPassword = formData.get("confirmPassword")?.toString() || "";

  // 2. Prepare payload
  const payload = {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
  };

  try {
    // 3. Send request to ASP.NET Core API
    const response = await fetch(`${getAuthApiUrl()}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    // 4. Handle non-200 responses
    if (!response.ok) {
      // Validation error (400)
      if (response.status === 400 && data?.errors) {
        return {
          success: false,
          errors: data.errors,
          message: data.title || data?.message || data?.Message || "Validation failed.",
        };
      }
      
      // Other errors (e.g. "Email Already Exist")
      return {
        success: false,
        message: data?.message || data?.Message || "An error occurred during registration.",
      };
    }

    // 5. Success
    // After registration, redirect to login page
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Network error: Unable to connect to the server. Please ensure the API is running.",
    };
  }
  
  redirect("/signin");
}

export async function loginUser(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const isAdmin = formData.get("isAdmin") === "true";

  const payload = {
    email,
    password,
  };

  try {
    const response = await fetch(`${getAuthApiUrl()}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 400 && data?.errors) {
        return {
          success: false,
          errors: data.errors,
          message: data.title || data?.message || data?.Message || "Validation failed.",
        };
      }
      
      return {
        success: false,
        message: data?.message || data?.Message || "Invalid password or email.",
      };
    }

    // Success - Save JWT token in HTTP-Only cookie
    if (data?.token) {
      const cookieStore = await cookies();
      const cookieName = isAdmin ? "admin_token" : "token";
      cookieStore.set(cookieName, data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }

  } catch (error) {
    // Note: Next.js `redirect()` throws an error to halt execution. We must NOT catch and swallow it.
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error;
    }
    
    console.error("Login error:", error);
    return {
      success: false,
      message: "Network error: Unable to connect to the server. Please ensure the API is running.",
    };
  }
  
  // Redirect based on the hidden input from the form, default to home
  const redirectTo = formData.get("redirectTo")?.toString() || "/";
  redirect(redirectTo);
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  cookieStore.delete("token");
  redirect("/signin");
}

