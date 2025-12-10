import { supabase } from '@db';
/**
 * Set/restore a user session from tokens
 * Use this when you need to perform authenticated database operations on behalf of a user
 */
export async function setUserSession(tokens) {
    if (!supabase) {
        return { session: null, error: new Error('Supabase client not initialized') };
    }
    try {
        const { data, error } = await supabase.auth.setSession({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
        });
        if (error) {
            console.error('Failed to set session:', error.message);
            return { session: null, error };
        }
        return { session: data.session, error: null };
    }
    catch (err) {
        console.error('Session error:', err.message || err);
        return { session: null, error: err };
    }
}
/**
 * Get the current active session
 */
export async function getCurrentSession() {
    if (!supabase) {
        return { session: null, error: new Error('Supabase client not initialized') };
    }
    try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            return { session: null, error };
        }
        return { session: data.session, error: null };
    }
    catch (err) {
        return { session: null, error: err };
    }
}
/**
 * Refresh the current session using the refresh token
 * Returns a new session with updated access_token
 */
export async function refreshSession(refresh_token) {
    if (!supabase) {
        return { session: null, error: new Error('Supabase client not initialized') };
    }
    try {
        const { data, error } = await supabase.auth.refreshSession({
            refresh_token
        });
        if (error) {
            console.error('Failed to refresh session:', error.message);
            return { session: null, error };
        }
        return { session: data.session, error: null };
    }
    catch (err) {
        console.error('Refresh error:', err.message || err);
        return { session: null, error: err };
    }
}
/**
 * Clear the current session (logout)
 */
export async function clearSession() {
    if (!supabase) {
        return { error: new Error('Supabase client not initialized') };
    }
    try {
        const { error } = await supabase.auth.signOut();
        return { error: error || null };
    }
    catch (err) {
        return { error: err };
    }
}
/**
 * Middleware helper: Set session from request headers and perform authenticated action
 * Useful for routes that need to act on behalf of the authenticated user
 */
export async function withUserSession(tokens, action) {
    const { session, error: sessionError } = await setUserSession(tokens);
    if (sessionError || !session) {
        return { data: null, error: sessionError || new Error('Failed to establish session') };
    }
    try {
        const result = await action();
        return { data: result, error: null };
    }
    catch (err) {
        return { data: null, error: err };
    }
}
