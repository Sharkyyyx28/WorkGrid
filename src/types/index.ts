import { Request } from 'express';
import { Role } from '@prisma/client';
import { JwtPayload } from './auth.types';

export interface TenantContext {
  organizationId: string;
  userId: string;
  role: Role;
}

// Example custom request interface extending Express Request
export interface CustomRequest<T = any, Q = any> extends Request<any, any, T, any> {
  query: Q;
  user?: JwtPayload;
  tenant?: TenantContext;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage?: boolean;
    nextCursor?: string | null;
  };
}
