import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { CustomExceptionsFilter } from './filter/CustomExceptionsFilter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use('/public', express.static(join(__dirname, '../../public')));
  app.useGlobalFilters(new CustomExceptionsFilter());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
