import { supabase } from '../db/supabaseClient.js';
/**
 * Register a new user using Supabase Auth
 * Uses signUp which allows public registration
 */
export async function register(req, res) {
    const { email, password, full_name } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'email and password required' });
    }
    if (!supabase) {
        return res.status(500).json({ error: 'Supabase client not configured' });
    }
    try {
        // Sign up a new user with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: full_name || null
                }
            }
        });
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(201).json({
            message: 'User registered successfully',
            user: data.user,
            session: data.session
        });
    }
    catch (err) {
        console.error('Registration error:', err);
        return res.status(500).json({ error: 'Unknown server error' });
    }
}
/**
 * Login user with email and password
 */
export async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'email and password required' });
    }
    if (!supabase) {
        return res.status(500).json({ error: 'Supabase client not configured' });
    }
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            return res.status(401).json({ error: error.message });
        }
        return res.json({
            message: 'Login successful',
            user: data.user,
            session: data.session
        });
    }
    catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Unknown server error' });
    }
}
/**
 * Logout user (sign out from Supabase Auth)
 */
export async function logout(_req, res) {
    if (!supabase) {
        return res.status(500).json({ error: 'Supabase client not configured' });
    }
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            return res.status(400).json({ error: error.message });
        }
        return res.json({ message: 'Logout successful' });
    }
    catch (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Unknown server error' });
    }
}
