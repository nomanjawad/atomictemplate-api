import { Router } from 'express';
import authRouter from './auth/index.js';
import blogRouter from './blog/index.js';
import adminRouter from './admin/index.js';
import contentRouter from './content/index.js';
import uploadRouter from './upload/index.js';
const router = Router();
// Authentication routes
router.use('/auth', authRouter);
// Content management routes
router.use('/content', contentRouter);
router.use('/blog', blogRouter);
// Upload routes
router.use('/upload', uploadRouter);
// Admin routes
router.use('/admin', adminRouter);
export default router;
