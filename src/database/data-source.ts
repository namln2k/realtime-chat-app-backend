import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const configService: ConfigService = new ConfigService();

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'sqlite',
  database: configService.get<string>('DATABASE_NAME') || 'sqlite.db',
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/database/migrations/*.{ts,js}'],
  seeds: ['dist/database/seeds/*.{ts,js}'],
};

export default new DataSource(dataSourceOptions);
