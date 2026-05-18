import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export class UserValidator {
  public static validateCreate(req: Request, res: Response, next: NextFunction): void {
    const { email, name } = req.body;

    if (!email || typeof email !== 'string') {
      return next(new AppError('Valid email is required', 400));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError('Invalid email format', 400));
    }

    if (name && typeof name !== 'string') {
      return next(new AppError('Name must be a string', 400));
    }

    next();
  }

  public static validateUpdate(req: Request, res: Response, next: NextFunction): void {
    const { email, name } = req.body;

    if (email && typeof email !== 'string') {
      return next(new AppError('Email must be a string', 400));
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return next(new AppError('Invalid email format', 400));
      }
    }

    if (name && typeof name !== 'string') {
      return next(new AppError('Name must be a string', 400));
    }

    next();
  }
}
