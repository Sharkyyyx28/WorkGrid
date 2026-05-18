import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ProjectStatus } from '@prisma/client';

export class ProjectValidator {
  public static createSchema = z.object({
    body: z.object({
      name: z.string().min(1, 'Project name is required'),
      description: z.string().optional().nullable(),
      status: z.nativeEnum(ProjectStatus).optional(),
    }),
  });

  public static updateSchema = z.object({
    body: z.object({
      name: z.string().min(1, 'Project name cannot be empty').optional(),
      description: z.string().optional().nullable(),
      status: z.nativeEnum(ProjectStatus).optional(),
    }),
  });

  public static querySchema = z.object({
    query: z.object({
      page: z.string().regex(/^\d+$/).optional().transform(Number),
      limit: z.string().regex(/^\d+$/).optional().transform(Number),
      status: z.nativeEnum(ProjectStatus).optional(),
      search: z.string().optional(),
      sortBy: z.enum(['name', 'createdAt', 'status', 'updatedAt']).optional(),
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
        if (parsed.query) req.query = parsed.query;
        if (parsed.body) req.body = parsed.body;

        next();
      } catch (error) {
        next(error);
      }
    };
}
