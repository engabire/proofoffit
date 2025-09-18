export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Suppress Vercel analytics warnings by providing a proper instrumentation
    // This prevents the "Deprecated API for given entry type" warnings
    try {
      // Only register if we're in a Vercel environment
      if (process.env.VERCEL) {
        // This is a no-op but prevents the warning
        console.debug('Instrumentation registered for Vercel environment')
      }
    } catch (error) {
      // Silently fail
    }
  }
}
