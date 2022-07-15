import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer, ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { TransformInterceptor } from './modules/common/interceptors/response';
import { normalizeValidationError } from './modules/common/utility/exception.utility';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const documentApiConfig = new DocumentBuilder()
    .setTitle('RM Ecommerce API')
    .setDescription('The RM Ecommerce service API documents')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const documentApi = SwaggerModule.createDocument(app, documentApiConfig);

  if (process.env.ENABLE_SWAGGER == 'true') {
    SwaggerModule.setup('api-docs', app, documentApi);
  }

  // Global Validation Custom
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        if (errors.length > 0) throw new BadRequestException(normalizeValidationError(errors));
      },
    }),
  );
  // Response Transformer Mapping
  app.useGlobalInterceptors(new TransformInterceptor());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
