import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //Think of ValidationPipe as a security guard between the client request and your controller.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //Only properties defined in the DTO are allowed. 
      forbidNonWhitelisted: true, //Instead of silently removing unknown fields, throw an error. (DTO) has only name and email but when create add new in postman body will get error message
      transform: true,
    }),
  );

   app.useStaticAssets(
    join(__dirname, '..', 'uploads'),
    {
      prefix: '/uploads/',
    },
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
