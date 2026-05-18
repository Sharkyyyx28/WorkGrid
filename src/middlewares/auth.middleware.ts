import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { JwtToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { CustomRequest } from '../types';

export class AuthMiddleware {
  public static authenticate = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): void => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please provide a valid token.', 401));
    }

    try {
      const decoded = JwtToken.verify(token);
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };

  public static requireRole =
    (roles: Role[]) => (req: CustomRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        return next(new AppError('Authentication required to perform this action.', 401));
      }

      if (!roles.includes(req.user.role)) {
        return next(
          new AppError('You do not have permission to perform this action.', 403)
        );
      }

      next();
    };
}
