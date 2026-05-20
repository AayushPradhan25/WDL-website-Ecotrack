import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration - allow all origins in development
  app.enableCors({
    origin: true, // Allow all origins - use strict configuration in production
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe — validates request bodies automatically
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Global exception filter for consistent error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
  console.log('🚀 EcoSmart Backend running at http://localhost:3000');
}
bootstrap();