/**
 * Centralized API configuration and URL normalization helper.
 * 
 * Handles URL formatting variations (with or without /api, trailing slashes, http vs https for somee.com).
 */

export function getBaseUrl(): string {
  let url = process.env.NEXT_PUBLIC_API_URL || "http://www.shopco.somee.com";
  
  // Remove all trailing slashes and spaces
  url = url.replace(/\/+$/, "").trim();
  
  // If the URL ends with /api, strip it so we always have the pure host base URL
  if (url.endsWith("/api")) {
    url = url.slice(0, -4);
  }

  // Ensure protocol exists (if user entered e.g. "shopco-j1sm.vercel.app" or "www.shopco.somee.com")
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = url.includes("somee.com") ? `http://${url}` : `https://${url}`;
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

  // 1. Normalize Windows backslashes to forward slashes
  let cleanPath = path.replace(/\\/g, "/").trim();

  // 2. Force http:// for somee.com (Somee free hosting does not support HTTPS)
  if (cleanPath.includes("somee.com") && cleanPath.startsWith("https://")) {
    cleanPath = cleanPath.replace(/^https:\/\//i, "http://");
  }

  // 3. If already absolute URL or blob/data
  if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://") || cleanPath.startsWith("blob:") || cleanPath.startsWith("data:")) {
    return cleanPath;
  }

  // 4. Relative paths: prepend base URL
  if (!cleanPath.startsWith("/")) {
    cleanPath = `/${cleanPath}`;
  }

  return `${getBaseUrl()}${cleanPath}`;
}

export const API_BASE_URL = getBaseUrl();
export const API_URL = getApiUrl();
