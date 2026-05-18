import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { AuthValidator } from '../validators/auth.validator';

const router = Router();

router.post(
  '/register',
  AuthValidator.validate(AuthValidator.registerSchema),
  authController.register
);
router.post('/login', AuthValidator.validate(AuthValidator.loginSchema), authController.login);

export const authRoutes = router;
