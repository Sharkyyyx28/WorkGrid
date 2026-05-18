import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { config } from '../config/env';

// Global Error Handler Middleware
export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: any = undefined;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Database operation failed due to known constraint violation';
  } else if (err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message = 'Database validation error';
  } else if (err.name === 'ValidationError') {
    // Custom validation errors
    statusCode = 422;
    message = err.message;
  } else {
    // Fallback for unhandled/unexpected errors
    message = err.message || 'Internal Server Error';
  }

  // Log error details in development
  if (config.nodeEnv === 'development') {
    console.error(`[Error] ${err.stack || err.message}`);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode,
      message,
      ...(errors && { details: errors }),
      ...(config.nodeEnv === 'development' && { stack: err.stack }),
    },
  });
};
