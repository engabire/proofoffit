import { createBrowserClient } from '@supabase/ssr'
import { isSupabaseConfigured } from '../env'

export function createClientSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return null
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}