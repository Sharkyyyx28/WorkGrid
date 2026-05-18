import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { UserValidator } from '../validators/user.validator';

const router = Router();

router
  .route('/')
  .post(UserValidator.validateCreate, userController.createUser)
  .get(userController.getUsers);

router
  .route('/:id')
  .get(userController.getUserById)
  .put(UserValidator.validateUpdate, userController.updateUser)
  .delete(userController.deleteUser);

export const userRoutes = router;
