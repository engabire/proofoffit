import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  res.headers.set('X-Frame-Options', 'SAMEORIGIN')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  res.headers.set('Cross-Origin-Resource-Policy', 'same-origin')
  // Basic CSP (nonce/hash free). Consider tightening later.
  if (!res.headers.get('Content-Security-Policy')) {
    res.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'", 
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
        "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live", 
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: blob: https:",
        "font-src 'self' data: https://fonts.gstatic.com",
        "connect-src 'self' https:",
        "frame-ancestors 'self'",
      ].join('; ')
    )
  }
  return res
}

export const config = {
  matcher: ['/((?!api/health|_next/static|_next/image|favicon.ico).*)'],
}
