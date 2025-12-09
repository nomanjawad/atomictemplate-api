/**
 * @module middleware/error
 * @description Global error handling middleware
 */

import { Request, Response, NextFunction } from 'express'

/**
 * Global error handler middleware
 * Catches all unhandled errors and returns a JSON response
 * @param {Error} err - The error object
 * @param {Request} _req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} _next - Express next function
 * @returns {Response} JSON error response with status code
 */
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err)
  const status = err?.status || 500
  res.status(status).json({ error: err?.message || 'Internal Server Error' })
}
