/**
 * @module db/supabaseClient
 * @description Supabase client initialization and configuration
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'

/** @constant {string} Supabase project URL from environment */
const SUPABASE_URL = process.env.SUPABASE_URL || ''

/**
 * @constant {string} Supabase anonymous key
 * Supports both SUPABASE_ANON_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY for flexibility
 */
const SUPABASE_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''

// Debug logging
console.log('DEBUG - SUPABASE_URL:', SUPABASE_URL ? 'present' : 'MISSING')
console.log('DEBUG - SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'present' : 'MISSING')
console.log('DEBUG - SUPABASE_KEY:', SUPABASE_KEY ? 'present' : 'MISSING')

if (!SUPABASE_URL) {
  console.error('SUPABASE_URL is not set')
}

if (!SUPABASE_KEY) {
  console.error('No Supabase key found in environment variables')
}

/**
 * Supabase client instance
 * Configured with auto token refresh, no session persistence (backend)
 * @type {SupabaseClient | null}
 */
export const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: {
          autoRefreshToken: true,
          persistSession: false, // Backend doesn't need to persist sessions
          detectSessionInUrl: false
        }
      })
    : null

// Log initialization status only on failure
if (!supabase) {
  console.error('Supabase client failed to initialize')
}

/**
 * Alias for supabase client (backwards compatibility)
 * @type {SupabaseClient | null}
 */
export const supabaseClient = supabase
