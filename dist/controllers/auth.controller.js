import { supabase } from '@db';
/**
 * Register a new user using Supabase Auth
 * Uses signUp which allows public registration
 */
export async function register(req, res) {
    const { email, password, full_name } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    if (!supabase) {
        console.error('Supabase client not configured - check environment variables');
        return res.status(500).json({ error: 'Authentication service unavailable' });
    }
    try {
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
            console.error('Registration error:', error.message);
            return res.status(400).json({ error: error.message });
        }
        return res.status(201).json({
            message: 'User registered successfully',
            user: data.user,
            session: data.session
        });
    }
    catch (err) {
        console.error('Registration failed:', err.message || err);
        return res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
}
/**
 * Login user with email and password
 */
export async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    if (!supabase) {
        console.error('Supabase client not configured - check environment variables');
        return res.status(500).json({ error: 'Authentication service unavailable' });
    }
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error('Login error:', error.message);
            return res.status(401).json({ error: error.message });
        }
        return res.json({
            message: 'Login successful',
            user: data.user,
            session: data.session
        });
    }
    catch (err) {
        console.error('Login failed:', err.message || err);
        return res.status(500).json({ error: 'Login failed. Please try again.' });
    }
}
/**
 * Logout user (sign out from Supabase Auth)
 */
export async function logout(_req, res) {
    if (!supabase) {
        console.error('Supabase client not configured - check environment variables');
        return res.status(500).json({ error: 'Authentication service unavailable' });
    }
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error.message);
            return res.status(400).json({ error: error.message });
        }
        return res.json({ message: 'Logout successful' });
    }
    catch (err) {
        console.error('Logout failed:', err.message || err);
        return res.status(500).json({ error: 'Logout failed. Please try again.' });
    }
}
/**
 * Get current user profile (JWT protected endpoint)
 * Demonstrates JWT authentication in action
 */
export async function getProfile(req, res) {
    try {
        // User is attached by requireAuth middleware after JWT verification
        const user = req.user;
        if (!user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        return res.json({
            user: {
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name,
                avatar_url: user.user_metadata?.avatar_url,
                created_at: user.created_at,
                email_confirmed_at: user.email_confirmed_at
            }
        });
    }
    catch (err) {
        console.error('Get profile failed:', err.message || err);
        return res.status(500).json({ error: 'Failed to retrieve profile' });
    }
}
