export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Suppress Vercel analytics warnings by providing a proper instrumentation
    // This prevents the "Deprecated API for given entry type" warnings
    try {
      // Only register if we're in a Vercel environment
      if (process.env.VERCEL) {
        // Suppress the deprecated API warnings by providing a proper entry point
        const { register: registerVercel } = await import('@vercel/analytics')
        if (registerVercel) {
          registerVercel()
        }
      }
    } catch (error) {
      // Silently fail - this is expected if @vercel/analytics is not available
    }
  }
}
