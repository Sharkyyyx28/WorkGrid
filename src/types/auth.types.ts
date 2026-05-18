import { Role } from '@prisma/client';

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
  organizationId: string;
}

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: true;
  token: string;
  user: AuthUserResponse;
  organization?: {
    id: string;
    name: string;
  };
}
