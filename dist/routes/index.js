import { Router } from 'express';
import authRouter from './auth/index.js';
import blogRouter from './blog/index.js';
import adminRouter from './admin/index.js';
const router = Router();
router.use('/auth', authRouter);
router.use('/blog', blogRouter);
router.use('/admin', adminRouter);
export default router;
