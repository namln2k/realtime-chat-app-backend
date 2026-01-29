import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { JWT } from 'src/common/constants/app.constant';
import { User } from 'src/users/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async createHash(password: string) {
    return await bcrypt.hash(password, JWT.HASH_ROUNDS);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async createAccessToken(user: Partial<User>): Promise<string> {
    return await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      roles: user.roles,
      name: user.name,
    });
  }

  createRefreshToken(): string {
    return uuidv4();
  }

  calculateExpiryTimestamp(): number {
    const expiryHours = Number.parseInt(
      this.configService.get('REFRESH_TOKEN_EXPIRY_HOURS') || '24',
    );

    return moment().add(expiryHours, 'hours').unix();
  }

  async storeRefreshToken(
    token: string,
    userId: string,
  ): Promise<RefreshToken> {
    const expiresAt = this.calculateExpiryTimestamp();

    return await this.refreshTokenRepository.save({
      userId,
      value: token,
      expiresAt,
    });
  }

  async authenticateRefreshToken(token: string) {
    const existedToken = await this.refreshTokenRepository.findOneBy({
      value: token,
      isActive: true,
      expiresAt: MoreThan(moment().unix()),
    });

    if (!existedToken) {
      return null;
    }

    await this.refreshTokenRepository.update(existedToken.id, {
      isActive: false,
    });

    return existedToken;
  }
}
