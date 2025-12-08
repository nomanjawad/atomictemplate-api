import { Client } from 'pg'
import { supabaseAdmin, supabaseClient, HAS_SUPABASE_SERVICE_ROLE_KEY } from './supabaseClient.js'
import config from './config.js'

export async function checkPostgres() {
  if (!config.pgConnectionString || config.pgConnectionString.includes('://@:')) {
    return { ok: false, reason: 'PG connection string not configured' }
  }

  const client = new Client({ connectionString: config.pgConnectionString })
  try {
    await client.connect()
    await client.query('SELECT 1')
    await client.end()
    return { ok: true }
  } catch (err: any) {
    try {
      await client.end()
    } catch {}
    return { ok: false, reason: err?.message || String(err) }
  }
}

export async function checkSupabaseClient() {
  if (!supabaseClient) return { ok: false, reason: 'Supabase ANON client missing' }
  try {
    // Try to ping using a small, safe request. We choose a read from a table (may not exist).
    // This will fail if table doesn't exist but still indicates the API is reachable.
    const { error } = await supabaseClient.from('blog_posts').select('id').limit(1)
    if (error) {
      return { ok: false, reason: error.message }
    }
    return { ok: true }
  } catch (err: any) {
    return { ok: false, reason: err?.message || String(err) }
  }
}

export async function checkSupabaseAdmin() {
  if (!supabaseAdmin) return { ok: false, reason: 'Supabase SERVICE ROLE key missing' }
  try {
    // List users (limited) as a safe, admin-side check.
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1 }) as any
    if (error) return { ok: false, reason: error.message }
    return { ok: true }
  } catch (err: any) {
    return { ok: false, reason: err?.message || String(err) }
  }
}

export async function checkAllConnections() {
  const [pg, saClient, saAdmin] = await Promise.all([checkPostgres(), checkSupabaseClient(), checkSupabaseAdmin()])
  return {
    postgres: pg,
    supabaseClient: saClient,
    supabaseAdmin: saAdmin,
    adminKeyPresent: HAS_SUPABASE_SERVICE_ROLE_KEY,
  }
}

export default {
  checkAllConnections,
  checkPostgres,
  checkSupabaseClient,
  checkSupabaseAdmin,
}
