import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRole } from 'src/common/constants/roles.constants';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import {
  AuthenticatedRequest,
  AuthPayload,
} from 'src/common/types/authenticated-request.type';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request: AuthenticatedRequest = context.switchToHttp().getRequest();

    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: AuthPayload =
        await this.jwtService.verifyAsync<AuthPayload>(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });

      // Attach payload to request so it can be used by decorators and controllers
      request['user'] = payload;

      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      // If no roles are required, authentication is enough
      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      return payload.roles.some((role) => requiredRoles.includes(role.name));
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.Authentication;
  }
}
