import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { Role } from './entities/role.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TokenService } from './token.service';

@Module({
  providers: [AuthService, JwtStrategy, TokenService],
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    TypeOrmModule.forFeature([User, Role, RefreshToken]),
  ],
})
export class AuthModule {}
