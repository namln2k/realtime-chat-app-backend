import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Role } from '../../auth/entities/role.entity';

const roles = [
  { id: '8cdf8858-2b0b-4192-8016-1de183493664', name: 'admin' },
  { id: 'f87700b3-58dd-40b1-985f-4e14ae926570', name: 'moderator' },
  { id: '5e5cfaa9-fc50-4bfe-bdbe-f29b81413437', name: 'user' },
  { id: '1f332442-d867-4cd6-83eb-cfa351779ce1', name: 'guest' },
];

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    await dataSource.query('DELETE FROM `role`;');

    const repository = dataSource.getRepository(Role);
    for (const role of roles) {
      const newRole = repository.create(role);
      await repository.save(newRole);
    }
  }
}
