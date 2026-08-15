import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const urlParam = searchParams.get("url");

  if (!urlParam) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  let targetUrl = urlParam.trim().replace(/\\/g, "/");

  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    const cleanPath = targetUrl.startsWith("/") ? targetUrl : `/${targetUrl}`;
    targetUrl = `http://www.shopco.somee.com${cleanPath}`;
  }

  // Force http:// for somee.com (Somee doesn't support HTTPS)
  if (targetUrl.includes("somee.com") && targetUrl.startsWith("https://")) {
    targetUrl = targetUrl.replace(/^https:\/\//i, "http://");
  }

  try {
    const res = await fetch(targetUrl, {
      cache: "force-cache",
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return new NextResponse(`Failed to fetch image: ${res.statusText}`, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error: any) {
    console.error("Error proxying image:", error);
    return new NextResponse("Error proxying image", { status: 500 });
  }
}
