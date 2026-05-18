import { Router, Request, Response } from 'express';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { projectRoutes } from './project.routes';
import { taskRoutes } from './task.routes';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { TenantMiddleware } from '../middlewares/tenant.middleware';

const router = Router();

// Health Check Endpoint
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);

router.use(AuthMiddleware.authenticate);
router.use(TenantMiddleware.enforceTenancy);

router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);

export const apiRoutes = router;
