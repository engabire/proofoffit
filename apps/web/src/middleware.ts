import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { securityMiddleware } from '@/lib/security'

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'fr', 'rw', 'sw', 'ln'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Don't add locale prefix for default locale
  localePrefix: 'as-needed'
})

export default function middleware(request: NextRequest) {
  // Apply security middleware first
  const securityResponse = securityMiddleware(request)
  if (securityResponse.status !== 200) {
    return securityResponse
  }
  
  // Apply internationalization middleware
  return intlMiddleware(request)
}

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - _static (inside /public)
  // - all root files inside /public (e.g. favicon.ico)
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - _next (Next.js internals)
    // - _static (inside /public)
    // - all root files inside /public (e.g. favicon.ico)
    '/((?!api|_next|_static|.*\\..*|_vercel|[\\w-]+\\.\\w+).*)'
  ]
}