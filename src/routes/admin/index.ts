import { Router } from 'express'
import { adminStatus } from '@controllers'

const router = Router()

router.get('/status', adminStatus)

export default router
