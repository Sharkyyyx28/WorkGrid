import { Prisma, Task } from '@prisma/client';
import { prisma } from '../config/prisma';

// Optimized select to avoid pulling unnecessary heavy relations
const taskSelect = {
  id: true,
  title: true,
  description: true,
  priority: true,
  status: true,
  dueDate: true,
  projectId: true,
  assignedTo: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true,
};

export class TaskRepository {
  public async create(data: Prisma.TaskUncheckedCreateInput): Promise<Partial<Task>> {
    return prisma.task.create({
      data,
      select: taskSelect,
    });
  }

  public async findById(id: string, organizationId: string): Promise<Partial<Task> | null> {
    return prisma.task.findFirst({
      where: {
        id,
        organizationId,
      },
      select: taskSelect,
    });
  }

  public async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TaskWhereUniqueInput;
    where: Prisma.TaskWhereInput;
    orderBy?: any;
  }): Promise<Partial<Task>[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return prisma.task.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: taskSelect,
    });
  }

  public async count(where: Prisma.TaskWhereInput): Promise<number> {
    return prisma.task.count({ where });
  }

  public async update(id: string, data: Prisma.TaskUncheckedUpdateInput): Promise<Partial<Task>> {
    return prisma.task.update({
      where: { id },
      data,
      select: taskSelect,
    });
  }

  public async delete(id: string): Promise<Partial<Task>> {
    return prisma.task.delete({
      where: { id },
      select: taskSelect,
    });
  }
}

export const taskRepository = new TaskRepository();
