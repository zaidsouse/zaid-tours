import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow NextAuth API routes and Google OAuth callback page
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/auth/')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;

  const publicRoutes = ['/', '/login', '/signup', '/about', '/services'];
  const isPublicRoute = publicRoutes.includes(pathname);

  const protectedRoutes = ['/dashboard', '/admin', '/profile'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if ((pathname === '/login' || pathname === '/signup') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
