import { Request } from 'express';

// Example custom request interface extending Express Request
export interface CustomRequest<T = any, Q = any> extends Request<any, any, T, any> {
  query: Q;
  user?: {
    id: string;
    email: string;
  };
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
