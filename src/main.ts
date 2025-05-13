import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { Logger } from '@shared/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(new Logger());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Transactions API')
    .setDescription('Create and get statistics from Transactions')
    .setVersion('1.0')
    .addTag('Transactions')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.use(helmet());

  await app.listen(3000);
}
bootstrap();
