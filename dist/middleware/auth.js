import { supabaseClient } from '@db';
/**
 * JWT Authentication Middleware using Supabase
 * Verifies the JWT token from Authorization header
 * Token is validated by Supabase and user data is attached to request
 */
export async function requireAuth(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization token required' });
        }
        const token = header.split(' ')[1];
        if (!supabaseClient) {
            console.error('Supabase client not configured');
            return res.status(500).json({ error: 'Authentication service unavailable' });
        }
        // Verify JWT token with Supabase
        const { data, error } = await supabaseClient.auth.getUser(token);
        if (error || !data?.user) {
            console.error('JWT verification failed:', error?.message);
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        // Attach user to request object
        req.user = data.user;
        next();
    }
    catch (err) {
        console.error('Auth middleware error:', err.message || err);
        return res.status(500).json({ error: 'Authentication failed' });
    }
}
/**
 * Optional auth middleware - doesn't fail if no token
 * Attaches user if token is valid, otherwise continues without user
 */
export async function optionalAuth(req, res, next) {
    try {
        const header = req.headers.authorization;
        if (!header?.startsWith('Bearer ') || !supabaseClient) {
            return next();
        }
        const token = header.split(' ')[1];
        const { data } = await supabaseClient.auth.getUser(token);
        if (data?.user) {
            req.user = data.user;
        }
        next();
    }
    catch (err) {
        // Silently fail and continue without user
        next();
    }
}
