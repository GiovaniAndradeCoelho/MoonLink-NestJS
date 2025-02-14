import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true, 
  }));

  app.enableCors({
    origin: [process.env.ALLOW_DOMAINS],
  });

  await app.listen(6006);
}
bootstrap();
