import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const publicPaths = ['/login', '/api/login', '/api/logout', '/_next', '/favicon.ico'];

const KEY = () => new TextEncoder().encode(process.env.SESSION_SECRET || 'dev-secret');

export async function middleware(req: NextRequest) {
  if (publicPaths.some(p => req.nextUrl.pathname.startsWith(p))) return NextResponse.next();
  const token = req.cookies.get('session')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', req.url));
  try {
    await jwtVerify(token, KEY());
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL('/login', req.url));
    res.cookies.set('session', '', { maxAge: 0 });
    return res;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
