import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/entities/role.entity';
import { JWT } from 'src/common/constants/app.constant';
import { UserRole } from 'src/common/constants/roles.constants';
import { User } from 'src/users/entities/user.entity';
import { DataSource, In } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { bootstrapApplication } from '../bootstrap';

@Injectable()
export default class AdminUserSeeder implements Seeder {
  constructor() {}

  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);

    const app = await bootstrapApplication();
    const configService = app.get(ConfigService);
    const email = configService.get<string>('ADMIN_EMAIL') || '';
    const name = configService.get<string>('ADMIN_NAME') || '';
    const username = configService.get<string>('ADMIN_USERNAME') || '';
    const password = configService.get<string>('ADMIN_PASSWORD') || '';
    const passwordHash = await bcrypt.hash(password, JWT.HASH_ROUNDS);

    const existingUser = await userRepository.findOneBy({
      email: email,
    });

    const adminRole = await roleRepository.findOne({
      where: { name: UserRole.ADMIN },
    });

    if (!adminRole) {
      throw new Error('Admin role not found');
    }

    if (!existingUser) {
      const adminUser = userRepository.create({
        email,
        name,
        username,
        password: passwordHash,
        roles: [adminRole],
      });
      await userRepository.save(adminUser);
    } else {
      existingUser.roles = [adminRole];
      await userRepository.save(existingUser);
    }
  }
}
