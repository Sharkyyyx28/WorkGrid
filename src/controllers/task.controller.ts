import { Response } from 'express';
import { taskService, TaskService } from '../services/task.service';
import { asyncHandler } from '../utils/asyncHandler';
import { CustomRequest } from '../types';

export class TaskController {
  private service: TaskService;

  constructor(service: TaskService = taskService) {
    this.service = service;
  }

  public createTask = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const organizationId = req.tenant!.organizationId;
    const task = await this.service.createTask(organizationId, req.body);
    res.status(201).json({
      success: true,
      data: task,
    });
  });

  public getTasks = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const organizationId = req.tenant!.organizationId;
    const result = await this.service.getTasks(organizationId, req.query);
    res.status(200).json({
      success: true,
      ...result,
    });
  });

  public updateTask = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const organizationId = req.tenant!.organizationId;
    const task = await this.service.updateTask(req.params.id, organizationId, req.body);
    res.status(200).json({
      success: true,
      data: task,
    });
  });

  public deleteTask = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const organizationId = req.tenant!.organizationId;
    await this.service.deleteTask(req.params.id, organizationId);
    res.status(200).json({
      success: true,
      message: 'Task successfully deleted',
    });
  });
}

export const taskController = new TaskController();
