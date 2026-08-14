/**
 * Centralized API configuration and URL normalization helper.
 * 
 * Handles URL formatting variations (with or without /api, trailing slashes, http vs https for somee.com).
 */

export function getBaseUrl(): string {
  let url = process.env.NEXT_PUBLIC_API_URL || "http://www.shopco.somee.com";
  
  // Remove all trailing slashes
  url = url.replace(/\/+$/, "").trim();
  
  // If the URL ends with /api, strip it so we always have the pure host base URL
  if (url.endsWith("/api")) {
    url = url.slice(0, -4);
  }
  
  // Somee.com free hosting does not support HTTPS (causes ECONNRESET / connection refused).
  // Force http:// for somee.com domains.
  if (url.includes("somee.com") && url.startsWith("https://")) {
    url = url.replace(/^https:\/\//i, "http://");
  }
  
  return url;
}

export function getApiUrl(): string {
  return `${getBaseUrl()}/api`;
}

export function getImageUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${getBaseUrl()}${cleanPath}`;
}

export const API_BASE_URL = getBaseUrl();
export const API_URL = getApiUrl();
