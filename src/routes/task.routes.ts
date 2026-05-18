import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { TaskValidator } from '../validators/task.validator';

const router = Router();

router
  .route('/')
  .post(TaskValidator.validate(TaskValidator.createSchema), taskController.createTask)
  .get(TaskValidator.validate(TaskValidator.querySchema), taskController.getTasks);

router
  .route('/:id')
  .patch(TaskValidator.validate(TaskValidator.updateSchema), taskController.updateTask)
  .delete(taskController.deleteTask);

export const taskRoutes = router;
