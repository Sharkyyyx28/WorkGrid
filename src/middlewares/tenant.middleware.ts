import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types';
import { AppError } from '../utils/AppError';

export class TenantMiddleware {
  public static enforceTenancy = (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): void => {
    // 1. Ensure user authentication context exists
    if (!req.user) {
      return next(new AppError('Authentication required to identify tenant context.', 401));
    }

    const { id: userId, organizationId, role } = req.user;

    if (!organizationId) {
      return next(new AppError('Invalid token: No organization associated with user.', 403));
    }

    // 2. Attach tenant context to request
    req.tenant = {
      organizationId,
      userId,
      role,
    };

    // 3. Critical Rule: organizationId must NEVER come from frontend request body.
    // Check if req.body or req.query contains an explicit organizationId that conflicts with the tenant.
    if (req.body && req.body.organizationId && req.body.organizationId !== organizationId) {
      return next(
        new AppError(
          'Cross-tenant access is strictly prohibited. Mismatch in request body organizationId.',
          403
        )
      );
    }

    if (req.query && req.query.organizationId && req.query.organizationId !== organizationId) {
      return next(
        new AppError(
          'Cross-tenant access is strictly prohibited. Mismatch in query parameter organizationId.',
          403
        )
      );
    }

    // Forcefully override/strip any frontend organizationId in body/query to guarantee isolation
    if (req.body && typeof req.body === 'object') {
      req.body.organizationId = organizationId;
    }
    if (req.query && typeof req.query === 'object') {
      req.query.organizationId = organizationId;
    }

    next();
  };
}
