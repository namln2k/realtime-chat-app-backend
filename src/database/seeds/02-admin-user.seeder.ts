import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/entities/role.entity';
import { JWT } from 'src/common/constants/app.constant';
import { UserRole } from 'src/common/constants/roles.constants';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';
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
    const password = configService.get<string>('ADMIN_PASSWORD') || '';
    const passwordHash = await bcrypt.hash(password, JWT.HASH_ROUNDS);

    const existingUser = await userRepository.findOneBy({
      email: email,
    });

    const adminRole = await roleRepository.findBy({
      name: UserRole.ADMIN,
    });

    if (!existingUser && adminRole) {
      const adminUser = userRepository.create({
        email,
        name,
        password: passwordHash,
        roles: adminRole,
      });
      await userRepository.save(adminUser);
    }
  }
}
