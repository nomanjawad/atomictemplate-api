import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || ''

// Use anon key (JWT format) - this is the correct key for Supabase client
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

// Create a single Supabase client using the key (publishable or anon)
// This client will use Supabase Auth for authentication and RLS for security
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

// Export as supabaseClient for backwards compatibility
export const supabaseClient = supabase
