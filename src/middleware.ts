import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isTokenValid(token?: string): boolean {
  if (!token) return false;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const payloadBase64 = parts[1];
    const decodedJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const payload = JSON.parse(decodedJson);
    
    if (payload.exp) {
      const expirationTime = payload.exp * 1000;
      return expirationTime > Date.now();
    }
    return true;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get('admin_token')?.value;
  const userToken = request.cookies.get('token')?.value;

  const isAdminValid = isTokenValid(adminToken);
  const isUserValid = isTokenValid(userToken);
  const isAuthenticated = isUserValid || isAdminValid;

  // 1. Dashboard Routes Protection
  if (pathname.startsWith('/dashboard')) {
    // If accessing admin login page
    if (pathname === '/dashboard/admin-login') {
      if (isAdminValid) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      return NextResponse.next();
    }

    // All other /dashboard routes require valid admin_token
    if (!isAdminValid) {
      const response = NextResponse.redirect(new URL('/dashboard/admin-login', request.url));
      if (adminToken) {
        response.cookies.delete('admin_token');
      }
      return response;
    }

    return NextResponse.next();
  }

  // 2. Auth Routes Protection (Guest only: /signin, /signup)
  // If user is already logged in, redirect them away from signin/signup to home '/'
  const guestAuthRoutes = ['/signin', '/signup'];
  const isGuestAuthRoute = guestAuthRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isGuestAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // 3. Storefront Protected Routes (Requires authentication: /cart, /checkout, /profile, etc.)
  const protectedStorefrontRoutes = ['/cart', '/checkout', '/profile'];
  const isProtectedStorefrontRoute = protectedStorefrontRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedStorefrontRoute) {
    if (!isAuthenticated) {
      const response = NextResponse.redirect(new URL('/signin', request.url));
      if (userToken && !isUserValid) {
        response.cookies.delete('token');
      }
      return response;
    }
  }

  // 4. Default pass-through, clean invalid user token on public routes if expired
  let response = NextResponse.next();
  if (userToken && !isUserValid) {
    response.cookies.delete('token');
  }

  return response;
}

export const config = {
  // Match all request paths except static files, api, images, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
