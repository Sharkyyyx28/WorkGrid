import { Prisma, Task } from '@prisma/client';
import { taskRepository, TaskRepository } from '../repositories/task.repository';
import { projectService, ProjectService } from './project.service';
import { userService, UserService } from './user.service';
import { AppError } from '../utils/AppError';
import { PaginatedResponse } from '../types';
import { PaginationUtil } from '../utils/pagination';

export class TaskService {
  private repo: TaskRepository;
  private projectSvc: ProjectService;
  private userSvc: UserService;

  constructor(
    repo: TaskRepository = taskRepository,
    projectSvc: ProjectService = projectService,
    userSvc: UserService = userService
  ) {
    this.repo = repo;
    this.projectSvc = projectSvc;
    this.userSvc = userSvc;
  }

  public async createTask(
    organizationId: string,
    data: Prisma.TaskUncheckedCreateInput
  ): Promise<Partial<Task>> {
    // 1. Validate project ownership before task creation
    await this.projectSvc.getProjectById(data.projectId, organizationId);

    // 2. Prevent assigning task to another tenant user
    if (data.assignedTo) {
      await this.userSvc.getUserById(data.assignedTo, organizationId);
    }

    return this.repo.create({
      ...data,
      organizationId,
    });
  }

  public async getTaskById(id: string, organizationId: string): Promise<Partial<Task>> {
    const task = await this.repo.findById(id, organizationId);
    if (!task) {
      throw new AppError('Task not found or access denied', 404);
    }
    return task;
  }

  public async getTasks(
    organizationId: string,
    query: {
      page?: number;
      limit?: number;
      cursor?: string;
      status?: any;
      priority?: any;
      projectId?: string;
      assignedTo?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<PaginatedResponse<Partial<Task>>> {
    // Build tenant-isolated and filtered where clause
    const where: Prisma.TaskWhereInput = {
      organizationId,
      ...(query.status && { status: query.status }),
      ...(query.priority && { priority: query.priority }),
      ...(query.projectId && { projectId: query.projectId }),
      ...(query.assignedTo && { assignedTo: query.assignedTo }),
    };

    const prismaParams = PaginationUtil.getPrismaParams(query, 'createdAt');

    const [tasks, total] = await Promise.all([
      this.repo.findAll({ ...prismaParams, where }),
      this.repo.count(where),
    ]);

    return PaginationUtil.formatResponse(tasks, total, query);
  }

  public async updateTask(
    id: string,
    organizationId: string,
    data: Prisma.TaskUncheckedUpdateInput
  ): Promise<Partial<Task>> {
    // 1. Verify task existence and tenant ownership
    await this.getTaskById(id, organizationId);

    // 2. If assigning to a user, verify the user belongs to this tenant
    if (data.assignedTo && typeof data.assignedTo === 'string') {
      await this.userSvc.getUserById(data.assignedTo, organizationId);
    }

    return this.repo.update(id, data);
  }

  public async deleteTask(id: string, organizationId: string): Promise<Partial<Task>> {
    // Verify task existence and tenant ownership before deleting
    await this.getTaskById(id, organizationId);
    return this.repo.delete(id);
  }
}

export const taskService = new TaskService();
