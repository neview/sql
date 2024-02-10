import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(session({
    secret: 'guang', // 加密cookie的密钥
    resave: false, // session没变的时候要不要重新生成cookie
    saveUninitialized: false, // 没登陆要不要创建一个session
  }))

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
