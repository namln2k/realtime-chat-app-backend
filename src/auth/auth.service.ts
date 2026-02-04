import {
  BadRequestException,
  Injectable,
  NotFoundException,
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
import { AuthResponse, AuthUser } from 'src/common/types/authenticated-request.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async register(register: RegisterDto): Promise<AuthResponse> {
    const { email, name, username, password } = register;

    const userRole = await this.roleRepository.findBy({
      name: UserRole.USER,
    });

    try {
      const user = await this.userService.save({
        email,
        name,
        username,
        password: await this.tokenService.createHash(password),
        roles: userRole,
      });

      return this.createTokens(user as User);
    } catch (error) {
      if (error?.code === SQLITE_ERROR_CODES.SQLITE_CONSTRAINT) {
        throw new BadRequestException('Email or username already exists');
      }

      throw error;
    }
  }

  async authenticate({ identifier, password }: LogInDto): Promise<User> {
    const user = await this.userService.findOne({
      where: [{ email: identifier }, { username: identifier }],
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

  async login(loginDto: LogInDto): Promise<AuthResponse> {
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
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    };
  }

  async getMe(userId: string): Promise<AuthUser> {
    const user = await this.userService.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  }
}
