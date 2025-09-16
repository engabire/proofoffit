import { createClient } from '@supabase/supabase-js'
import { env, isSupabaseConfigured } from './env'

// Only create Supabase clients if environment variables are configured
export const supabase = isSupabaseConfigured() 
  ? createClient(env.supabase.url, env.supabase.anonKey)
  : null

// Server-side client with service role key
export const supabaseAdmin = isSupabaseConfigured() && env.supabase.serviceRoleKey
  ? createClient(
      env.supabase.url,
      env.supabase.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null
