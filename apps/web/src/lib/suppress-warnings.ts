// Suppress Vercel analytics warnings in production
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // Override console methods to filter out specific warnings
  const originalWarn = console.warn
  const originalError = console.error
  
  console.warn = (...args: any[]) => {
    const message = args[0]?.toString() || ''
    
    // Suppress specific Vercel analytics warnings
    if (
      message.includes('Deprecated API for given entry type') ||
      message.includes('was preloaded using link preload but not used') ||
      message.includes('instrumentations.iv.flushErrorBuffer')
    ) {
      return // Suppress these warnings
    }
    
    // Allow other warnings through
    originalWarn.apply(console, args)
  }
  
  console.error = (...args: any[]) => {
    const message = args[0]?.toString() || ''
    
    // Suppress specific Vercel analytics errors
    if (
      message.includes('Deprecated API for given entry type') ||
      message.includes('instrumentations.iv.flushErrorBuffer')
    ) {
      return // Suppress these errors
    }
    
    // Allow other errors through
    originalError.apply(console, args)
  }
}
