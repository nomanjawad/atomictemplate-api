/**
 * @module middleware/validate
 * @description Request body validation middleware using Zod schemas
 */

import { ZodSchema } from 'zod'
import type { Request, Response, NextFunction } from 'express'

/**
 * Request body validation middleware factory
 * Validates request body against a Zod schema
 * @param {ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 * @example
 * import { BlogPostSchema } from '@atomictemplate/validations'
 * router.post('/posts', validate(BlogPostSchema), createPost)
 */
export function validate(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) return res.status(400).json({ errors: result.error.issues })
    req.body = result.data
    next()
  }
}
