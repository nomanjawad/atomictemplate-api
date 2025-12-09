/**
 * Content Routes
 * Handles routes for common components and page content
 */
import { Router } from 'express'
import * as contentController from '@controllers'
import { requireAuth, optionalAuth } from '@middleware'

const router = Router()

// ============================================================================
// Common Content Routes
// ============================================================================

/**
 * GET /api/content/common
 * List all common content (public)
 */
router.get('/common', contentController.listCommonContent)

/**
 * GET /api/content/common/:key
 * Get common content by key (public)
 */
router.get('/common/:key', contentController.getCommonContent)

/**
 * PUT /api/content/common/:key
 * Create or update common content by key (requires auth)
 */
router.put('/common/:key', requireAuth, contentController.upsertCommonContent)

/**
 * DELETE /api/content/common/:key
 * Delete common content by key (requires auth)
 */
router.delete('/common/:key', requireAuth, contentController.deleteCommonContent)

// ============================================================================
// Page Content Routes
// ============================================================================

/**
 * GET /api/content/pages
 * List all pages (public - published only, auth - all)
 */
router.get('/pages', optionalAuth, contentController.listPages)

/**
 * GET /api/content/pages/:slug
 * Get page by slug (public - published only, auth - all)
 */
router.get('/pages/:slug', optionalAuth, contentController.getPage)

/**
 * PUT /api/content/pages/:slug
 * Create or update page by slug (requires auth)
 */
router.put('/pages/:slug', requireAuth, contentController.upsertPage)

/**
 * DELETE /api/content/pages/:slug
 * Delete page by slug (requires auth)
 */
router.delete('/pages/:slug', requireAuth, contentController.deletePage)

export default router
