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
  id: number;
  email: string;
  roles: Role[];
}

export interface AuthenticatedRequest extends Request {
  user: AuthPayload;
}
