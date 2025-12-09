import { Router } from 'express'
import { register, login, logout, getProfile } from '@controllers'
import { requireAuth } from '@middleware'

const router = Router()

// Public routes
router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)

// Protected routes (require JWT)
router.get('/me', requireAuth, getProfile)

export default router
