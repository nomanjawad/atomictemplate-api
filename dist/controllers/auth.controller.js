import { supabaseAdmin, supabaseClient, HAS_SUPABASE_SERVICE_ROLE_KEY } from '../db/supabaseClient.js';
export async function register(req, res) {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'email and password required' });
    // Only allow registration (admin create) if service role key is present
    if (!HAS_SUPABASE_SERVICE_ROLE_KEY || !supabaseAdmin) {
        return res.status(503).json({ error: 'Admin user creation is disabled on this server (missing admin key)' });
    }
    try {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        });
        if (error)
            return res.status(400).json({ error: error.message });
        return res.json({ user: data });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unknown server error' });
    }
}
export async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'email and password required' });
    try {
        // Use the client (anon) key to sign in users
        if (!supabaseClient)
            return res.status(500).json({ error: 'Supabase client not configured' });
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error)
            return res.status(401).json({ error: error.message });
        return res.json({ data });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unknown server error' });
    }
}
export async function logout(req, res) {
    try {
        const header = req.headers.authorization;
        if (!header?.startsWith('Bearer '))
            return res.status(400).json({ error: 'invalid token' });
        const token = header.split(' ')[1];
        if (!supabaseClient)
            return res.status(500).json({ error: 'Supabase client not configured' });
        const { error } = await supabaseClient.auth.signOut();
        if (error)
            return res.status(400).json({ error: error.message });
        return res.json({ ok: true });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Unknown server error' });
    }
}
