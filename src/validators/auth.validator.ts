import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export class AuthValidator {
  public static registerSchema = z.object({
    body: z.object({
      organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
      name: z.string().min(2, 'Name must be at least 2 characters'),
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters long'),
    }),
  });

  public static loginSchema = z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(1, 'Password is required'),
    }),
  });

  public static validate =
    (schema: z.AnyZodObject) => (req: Request, res: Response, next: NextFunction): void => {
      try {
        schema.parse({
          body: req.body,
          query: req.query,
          params: req.params,
        });
        next();
      } catch (error) {
        next(error);
      }
    };
}
