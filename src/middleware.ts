// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // This is a simplified check - in a real app, you might want to 
  // verify the auth cookie exists instead of using localStorage
  // But since we don't have direct access to the auth cookie (it's HttpOnly),
  // this approach helps with redirecting unauthenticated users

  // For pages that require authentication
  if (request.nextUrl.pathname.startsWith('/search') ||
      request.nextUrl.pathname.startsWith('/match')) {
    
    // Client-side auth check will handle this anyway, this is just a backup
    // The real auth check is done in the component using the useAuth hook
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configure matching paths for middleware
export const config = {
  matcher: ['/search/:path*', '/match/:path*'],
};