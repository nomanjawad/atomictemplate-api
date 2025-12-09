import type { Request, Response } from 'express'

/**
 * Get admin/system status
 */
export function adminStatus(_req: Request, res: Response) {
  return res.json({
    status: 'operational',
    environment: process.env.NODE_ENV || 'development',
    supabase: {
      url: process.env.SUPABASE_URL ? 'configured' : 'missing',
      publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY ? 'configured' : 'missing'
    },
    timestamp: new Date().toISOString()
  })
}
