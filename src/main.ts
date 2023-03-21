import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import SwaggerConfig from './config/swagger';
import { HttpExceptionFilter } from './shared/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  /**
   * Swagger documentation configuration
   */
  const document = SwaggerModule.createDocument(app, SwaggerConfig);
  SwaggerModule.setup('api', app, document);

  /**
   * Set global filters
   */
  app.useGlobalFilters(new HttpExceptionFilter());

  /**
   * Enabling validation pipes globally
   */
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
