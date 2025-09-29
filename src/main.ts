import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  const configService = app.get(ConfigService);
  app.use(cookieParser());
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('PickUp')
    .setDescription('Api Documentation for PickUp')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
    )
    .build()
  const document = () => SwaggerModule.createDocument(app, config);
  const options = {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      filter: true,
      showExtensions: true,
      tryItOutEnabled: true, // Enable "Try it out" by default
      supportedSubmitMethods: [
        'get',
        'put',
        'post',
        'delete',
        'options',
        'head',
        'patch',
        'trace',
      ],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onComplete: () => {
        console.log('Swagger UI initialized');
      },
    },
    customSiteTitle: 'PickUp API Documentation',
  };
  SwaggerModule.setup('api', app, document, options);
  const port = configService.get('PORT', process.env.PORT || 3400)
  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
  logger.log(`📚 Swagger UI available at: http://localhost:${port}/api`);
}
bootstrap();
