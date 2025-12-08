import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
export const HAS_SUPABASE_SERVICE_ROLE_KEY = Boolean(SUPABASE_SERVICE_ROLE_KEY);
if (!SUPABASE_URL) {
    console.warn('SUPABASE_URL is not set — Supabase clients will not be available');
}
// Production should require a service role key for admin operations
if (process.env.NODE_ENV === 'production' && !HAS_SUPABASE_SERVICE_ROLE_KEY) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is required in production — aborting');
    process.exit(1);
}
export const supabaseAdmin = SUPABASE_URL && HAS_SUPABASE_SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) : null;
export const supabaseClient = SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) : null;
// For convenience, export a default `supabase` variable (prefer admin when available)
export const supabase = supabaseAdmin ?? supabaseClient;
if (process.env.SUPABASE_ANON_KEY && !process.env.SUPABASE_PUBLISHABLE_KEY && !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    console.warn('Using legacy SUPABASE_ANON_KEY — consider switching to SUPABASE_PUBLISHABLE_KEY / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
}
