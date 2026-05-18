import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class TaskValidator {
  public static createSchema = z.object({
    body: z.object({
      title: z.string().min(1, 'Task title is required'),
      description: z.string().optional().nullable(),
      priority: z.nativeEnum(TaskPriority).optional(),
      status: z.nativeEnum(TaskStatus).optional(),
      dueDate: z.string().datetime().optional().nullable(),
      projectId: z.string().min(1, 'Project ID is required'),
      assignedTo: z.string().optional().nullable(),
    }),
  });

  public static updateSchema = z.object({
    body: z.object({
      title: z.string().min(1, 'Task title cannot be empty').optional(),
      description: z.string().optional().nullable(),
      priority: z.nativeEnum(TaskPriority).optional(),
      status: z.nativeEnum(TaskStatus).optional(),
      dueDate: z.string().datetime().optional().nullable(),
      assignedTo: z.string().optional().nullable(),
    }),
  });

  public static querySchema = z.object({
    query: z.object({
      page: z.string().regex(/^\d+$/).optional().transform(Number),
      limit: z.string().regex(/^\d+$/).optional().transform(Number),
      status: z.nativeEnum(TaskStatus).optional(),
      priority: z.nativeEnum(TaskPriority).optional(),
      projectId: z.string().optional(),
      assignedTo: z.string().optional(),
      sortBy: z.enum(['title', 'createdAt', 'dueDate', 'priority', 'status']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
    }),
  });

  public static validate =
    (schema: z.ZodTypeAny) => (req: Request, res: Response, next: NextFunction): void => {
      try {
        const parsed = schema.parse({
          body: req.body,
          query: req.query,
          params: req.params,
        }) as any;

        // Reattach transformed query/body back to request object
        if (parsed.query) req.query = parsed.query;
        if (parsed.body) req.body = parsed.body;

        next();
      } catch (error) {
        next(error);
      }
    };
}
