import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiKeyGuard } from './common/guards/api-key.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {enableImplicitConversion: true},
}));
  app.useGlobalGuards(new ApiKeyGuard());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
