import type { Request, Response } from 'express'
import { HAS_SUPABASE_SERVICE_ROLE_KEY } from '../db/supabaseClient.js'
import dbConfig from '../db/config.js'

export function adminStatus(_req: Request, res: Response) {
  return res.json({
    adminEnabled: Boolean(HAS_SUPABASE_SERVICE_ROLE_KEY),
    pg: {
      host: dbConfig.PGHOST,
      port: dbConfig.PGPORT,
      database: dbConfig.PGDATABASE,
      user: dbConfig.PGUSER ? 'SET' : 'UNSET',
    },
  })
}
