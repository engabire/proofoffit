import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'fr', 'rw', 'sw', 'ln'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Don't add locale prefix for default locale
  localePrefix: 'as-needed'
})

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(fr|rw|sw|ln)/:path*']
}