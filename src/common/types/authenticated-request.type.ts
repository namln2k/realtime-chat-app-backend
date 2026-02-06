import { Request } from 'express';
import { Role } from 'src/auth/entities/role.entity';

/**
{
  sub: <customer_id>,
  email: <customer_email>,
  roles: [<customer_roles>],
  name: <customer_name>,
  iat,
  exp
}
 */
export interface AuthPayload {
  sub: string;
  email: string;
  roles: Role[];
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthPayload;
}

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  roles: string[];
  createdAt: Date;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}