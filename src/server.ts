import app from './app.js'
import { checkAllConnections } from '@db'
import { config, logConfigSummary, isDevelopment } from '@config'
import { logger } from '@utils'

const PORT = config.PORT

async function start() {
  try {
    // Log configuration summary
    logConfigSummary()

    logger.info(`🚀 Server starting on port ${PORT}...`)
    logger.info('━'.repeat(50))

    // Check database and service connections
    const status = await checkAllConnections()

    if (status.healthy) {
      logger.info('✓ All services are healthy!')
    } else {
      logger.warn('⚠ Some services are not responding')
    }

    // Log connection status in development
    if (isDevelopment) {
      logger.debug('📊 Connection Status:')
      logger.debug(JSON.stringify(status, null, 2))
    }

    logger.info('━'.repeat(50))

    // Handle graceful shutdown
    if (typeof process.send === 'function') {
      process.on('SIGTERM', () => {
        logger.info('SIGTERM signal received: closing HTTP server')
        process.exit(0)
      })
    }

    // Start the server
    app.listen(PORT, () => {
      logger.info(`✓ Server is running on http://localhost:${PORT}`)
      logger.info(`✓ Health check available at http://localhost:${PORT}/api/health`)
      logger.info(`✓ Environment: ${config.NODE_ENV}`)
      logger.info('')
    })
  } catch (err: any) {
    logger.error('Failed to start server:', err)
    process.exit(1)
  }
}

start()
