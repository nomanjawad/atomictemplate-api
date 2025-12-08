import dotenv from 'dotenv'
dotenv.config()

import app from './app.js'
import { HAS_SUPABASE_SERVICE_ROLE_KEY } from './db/supabaseClient.js'
import { checkAllConnections } from './db/index.js'

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

async function start() {
	console.log(`Server starting on port ${PORT} — checking dependencies...`)
	try {
		const status = await checkAllConnections()
		console.log('Connection status:', JSON.stringify(status, null, 2))
	} catch (err) {
		console.warn('Failed health check at startup:', err)
	}

	if (typeof process.send === 'function') {
		// child process under ts-node-dev --respawn: ensure graceful shutdown
		process.on('SIGTERM', () => process.exit(0))
	}

	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
		if (!HAS_SUPABASE_SERVICE_ROLE_KEY) {
			console.warn('SUPABASE_SERVICE_ROLE_KEY not set — admin operations are disabled. To enable, set SUPABASE_SERVICE_ROLE_KEY in env.')
		}
	})
}

start()
