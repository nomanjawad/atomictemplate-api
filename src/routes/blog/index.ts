/**
 * Blog Routes
 * Handles routes for blog posts CRUD
 */
import { Router } from 'express'
import * as blogController from '@controllers'
import { requireAuth, optionalAuth } from '@middleware'

const router = Router()

/**
 * GET /api/blog
 * List all blog posts (public - published only, auth - all)
 */
router.get('/', optionalAuth, blogController.list)

/**
 * GET /api/blog/:slug
 * Get blog post by slug (public - published only, auth - all)
 */
router.get('/:slug', optionalAuth, blogController.get)

/**
 * POST /api/blog
 * Create new blog post (requires auth)
 */
router.post('/', requireAuth, blogController.create)

/**
 * PUT /api/blog/:slug
 * Update blog post by slug (requires auth)
 */
router.put('/:slug', requireAuth, blogController.update)

/**
 * DELETE /api/blog/:slug
 * Delete blog post by slug (requires auth)
 */
router.delete('/:slug', requireAuth, blogController.remove)

export default router
