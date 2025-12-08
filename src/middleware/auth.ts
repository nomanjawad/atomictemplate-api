import type { Request, Response, NextFunction } from 'express'
import { supabaseClient } from '../db/supabaseClient.js'

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) {
      res.status(401)
      return res.json({ error: 'No token' })
    }
    const token = header.split(' ')[1]
    if (!supabaseClient) {
      res.status(500)
      return res.json({ error: 'Supabase client not configured' })
    }
    const { data, error } = await supabaseClient.auth.getUser(token)
    if (error || !data?.user) {
      res.status(401)
      return res.json({ error: 'Invalid token' })
    }
    (req as any).user = data.user
    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Auth verification error' })
  }
}
