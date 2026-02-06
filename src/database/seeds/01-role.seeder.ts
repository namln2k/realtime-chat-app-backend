import { Injectable } from '@nestjs/common';
import { UserRole } from 'src/common/constants/roles.constants';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '../../auth/entities/role.entity';

const roles = [
  { id: uuidv4(), name: UserRole.ADMIN },
  { id: uuidv4(), name: UserRole.USER },
];

@Injectable()
export default class RoleSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Role);

    for (const role of roles) {
      const existing = await repository.findOneBy({ name: role.name });

      if (!existing) {
        const newRole = repository.create(role);
        await repository.save(newRole);
      }
    }
  }
}
