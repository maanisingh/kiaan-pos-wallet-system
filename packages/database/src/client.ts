import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

export type SupabaseClient = ReturnType<typeof createSupabaseClient>

/**
 * Create a Supabase client for browser/client-side usage
 */
export function createSupabaseClient(supabaseUrl: string, supabaseKey: string) {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

/**
 * Create a Supabase client for server-side usage with service role key
 */
export function createSupabaseServerClient(
  supabaseUrl: string,
  supabaseServiceKey: string
) {
  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

/**
 * Helper function to handle Supabase errors
 */
export function handleSupabaseError(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return 'An unknown error occurred'
}

/**
 * Check if Supabase error is a unique constraint violation
 */
export function isUniqueConstraintError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'code' in error) {
    return error.code === '23505'
  }
  return false
}
