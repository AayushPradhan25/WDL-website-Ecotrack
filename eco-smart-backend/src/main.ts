import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔓 OPEN THE CORS GATES: This tells Render to stop blocking Vercel
  app.enableCors({
    origin: true, // Automatically mirrors and accepts your Vercel link
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe — validates request bodies automatically
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Global exception filter for consistent error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Render handles the port automatically
  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on port: ${process.env.PORT || 3000}`);
}
bootstrap();