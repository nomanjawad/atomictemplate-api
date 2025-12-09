import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'

import apiRouter from '@routes/index.js'
import { checkAllConnections } from '@db'
import { errorHandler } from '@middleware'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Configure helmet to allow inline scripts for Tailwind CDN
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      },
    },
  })
)
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')))

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  })
)

app.get('/api/health', async (_req, res) => {
  try {
    const status = await checkAllConnections()
    res.json({ ok: true, status })
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || String(err) })
  }
})

app.use('/api', apiRouter)

app.use(errorHandler)

export default app
