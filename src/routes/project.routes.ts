import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { ProjectValidator } from '../validators/project.validator';

const router = Router();

router
  .route('/')
  .post(ProjectValidator.validate(ProjectValidator.createSchema), projectController.createProject)
  .get(ProjectValidator.validate(ProjectValidator.querySchema), projectController.getProjects);

router
  .route('/:id')
  .get(projectController.getProjectById)
  .patch(ProjectValidator.validate(ProjectValidator.updateSchema), projectController.updateProject)
  .delete(projectController.deleteProject);

export const projectRoutes = router;
