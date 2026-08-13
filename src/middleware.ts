import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  let response = NextResponse.next();

  // 1. Dashboard Routes logic
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    // If the path is exactly /dashboard/admin-login, let it pass without auth
    if (request.nextUrl.pathname !== '/dashboard/admin-login') {
      const adminToken = request.cookies.get('admin_token')?.value;
      let isTokenValid = false;

      if (adminToken) {
        try {
          const payloadBase64 = adminToken.split('.')[1];
          const decodedJson = atob(payloadBase64);
          const payload = JSON.parse(decodedJson);
          
          if (payload.exp) {
            const expirationTime = payload.exp * 1000;
            if (expirationTime > Date.now()) {
              isTokenValid = true;
            }
          } else {
            isTokenValid = true; 
          }
        } catch (error) {
          isTokenValid = false;
        }
      }

      if (!isTokenValid) {
        response = NextResponse.redirect(new URL('/dashboard/admin-login', request.url));
        response.cookies.delete('admin_token');
        return response; // Return early for redirect
      }
    }
  } 
  // 2. Normal User Token logic
  else {
    const userToken = request.cookies.get('token')?.value;
    if (userToken) {
      let isUserTokenValid = false;
      try {
        const payloadBase64 = userToken.split('.')[1];
        const decodedJson = atob(payloadBase64);
        const payload = JSON.parse(decodedJson);
        
        if (payload.exp) {
          const expirationTime = payload.exp * 1000;
          if (expirationTime > Date.now()) {
            isUserTokenValid = true;
          }
        } else {
          isUserTokenValid = true; 
        }
      } catch (error) {
        isUserTokenValid = false;
      }

      // If normal token is invalid/expired, delete it so the user is logged out
      if (!isUserTokenValid) {
        response.cookies.delete('token');
      }
    }
  }

  return response;
}

export const config = {
  // Match all request paths except static files, api, images, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
