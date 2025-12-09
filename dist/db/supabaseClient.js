import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
if (!SUPABASE_URL) {
    console.warn('SUPABASE_URL is not set — Supabase client will not be available');
}
if (!SUPABASE_PUBLISHABLE_KEY) {
    console.warn('SUPABASE_PUBLISHABLE_KEY is not set — Supabase client will not be available');
}
// Create a single Supabase client using the publishable key
// This client will use Supabase Auth for authentication and RLS for security
export const supabase = SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: {
            autoRefreshToken: true,
            persistSession: false, // Backend doesn't need to persist sessions
            detectSessionInUrl: false
        }
    })
    : null;
// Export as supabaseClient for backwards compatibility
export const supabaseClient = supabase;
// Legacy warning for old environment variable names
if (process.env.SUPABASE_ANON_KEY && !SUPABASE_PUBLISHABLE_KEY) {
    console.warn('Using legacy SUPABASE_ANON_KEY — consider switching to SUPABASE_PUBLISHABLE_KEY / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
}
