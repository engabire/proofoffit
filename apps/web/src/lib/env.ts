// Environment configuration with fallbacks
export const env = {
  // Supabase configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  
  // Stripe configuration
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    proPriceId: process.env.STRIPE_PRO_PRICE_ID || '',
  },
  
  // App configuration
  app: {
    demoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || 
              !process.env.NEXT_PUBLIC_SUPABASE_URL || 
              !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    secret: process.env.NEXTAUTH_SECRET || '',
  },
  
  // AI/LLM configuration (optional)
  ai: {
    openaiKey: process.env.OPENAI_API_KEY || '',
    anthropicKey: process.env.ANTHROPIC_API_KEY || '',
  },
  
  // Email configuration (optional)
  email: {
    resendKey: process.env.RESEND_API_KEY || '',
  }
}

// Helper functions
export const isSupabaseConfigured = () => {
  return !!(env.supabase.url && env.supabase.anonKey)
}

export const isStripeConfigured = () => {
  return !!(env.stripe.publishableKey && env.stripe.secretKey)
}

export const isDemoMode = () => {
  return env.app.demoMode
}
