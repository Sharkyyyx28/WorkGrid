import { Router, Request, Response } from 'express';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';

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

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export const apiRoutes = router;
