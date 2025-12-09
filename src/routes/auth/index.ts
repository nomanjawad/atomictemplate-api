import { Router } from 'express'
import * as authController from '../../controllers/auth.controller.js'
import { requireAuth } from '../../middleware/auth.js'

const router = Router()

// Public routes
router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', authController.logout)

// Protected routes (require JWT)
router.get('/me', requireAuth, authController.getProfile)

export default router
