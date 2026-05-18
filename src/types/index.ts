import { Request } from 'express';
import { JwtPayload } from './auth.types';

// Example custom request interface extending Express Request
export interface CustomRequest<T = any, Q = any> extends Request<any, any, T, any> {
  query: Q;
  user?: JwtPayload;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
