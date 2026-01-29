import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SQLITE_ERROR_CODES } from 'src/common/constants/error-codes.constant';
import { UserRole } from 'src/common/constants/roles.constants';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { LogInDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { Role } from './entities/role.entity';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async register(register: RegisterDto): Promise<boolean> {
    const { email, name, password } = register;

    const userRole = await this.roleRepository.findBy({
      name: UserRole.USER,
    });

    try {
      await this.userService.save({
        email,
        name,
        password: await this.tokenService.createHash(password),
        roles: userRole,
      });

      return true;
    } catch (error) {
      if (error?.code === SQLITE_ERROR_CODES.SQLITE_CONSTRAINT) {
        throw new BadRequestException('Email already exists');
      }

      throw error;
    }
  }

  async authenticate({ email, password }: LogInDto): Promise<User> {
    const user = await this.userService.findOne({
      where: {
        email,
      },
      relations: {
        roles: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordMatch = await this.tokenService.compareHash(
      password,
      user.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const existedToken = await this.tokenService.authenticateRefreshToken(
      refreshTokenDto.token,
    );

    if (!existedToken) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.userService.findOne({
      where: {
        id: existedToken.userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.createTokens(user);
  }

  async login(
    loginDto: LogInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.authenticate(loginDto);

    return this.createTokens(user);
  }

  async createTokens(user: User) {
    const accessToken = await this.tokenService.createAccessToken(user);
    const refreshToken = this.tokenService.createRefreshToken();
    await this.tokenService.storeRefreshToken(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
    };
  }
}
