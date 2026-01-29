import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';

export async function bootstrapApplication() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });
  return app;
}
