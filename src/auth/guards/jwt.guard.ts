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
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();

    const roles = this.reflector.getAllAndOverride<boolean>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If roles decorator is not found, this is a public route and should be accessible.
    if (!roles) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload: AuthPayload =
        await this.jwtService.verifyAsync<AuthPayload>(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });

      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      console.log(payload.roles);
      console.log(requiredRoles);

      return payload.roles.some((role) => requiredRoles.includes(role.name));
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
