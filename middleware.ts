import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getAuthCookieName } from '@/lib/auth';

const PUBLIC_PATHS = ['/login', '/verify', '/api/auth/login', '/api/verify'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths and static files
  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/'
  ) {
    // Redirect root to dashboard or login
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  const token = req.cookies.get(getAuthCookieName())?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete(getAuthCookieName());
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|certificate-template.png).*)'],
};
