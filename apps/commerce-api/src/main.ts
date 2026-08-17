import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { AppConfigService } from '@nexusflow/config';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const appConfig = app.get(AppConfigService);

  await app.listen(appConfig.http.port);
}

void bootstrap();
