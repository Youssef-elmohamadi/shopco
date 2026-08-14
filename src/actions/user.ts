"use server";

import { cookies } from "next/headers";

// Bypass SSL verification in development for local ASP.NET Core self-signed certificates
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { getApiUrl } from "@/utils/apiConfig";
const getUserApiUrl = () => `${getApiUrl()}/User`;

export async function getUserProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || cookieStore.get("admin_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const res = await fetch(`${getUserApiUrl()}/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error("Failed to fetch user profile:", res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    console.log("User Profile API Response:", data); // For debugging
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

