import { Router } from 'express'
import { list as listBlogs, get as getBlog } from '@controllers'

const router = Router()

router.get('/', listBlogs)
router.get('/:slug', getBlog)

export default router
