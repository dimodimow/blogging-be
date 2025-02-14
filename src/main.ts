import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DtoValidationException } from './utils/exceptions/dto-validation.exception';
import { RoleSeeder } from './utils/seeders/role.seeder';
import { TITLE, URL } from './utils/constants/swagger.constants';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().setTitle(TITLE).addBearerAuth().build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(URL, app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const errorMessages = errors.map((error) =>
          Object.values(error.constraints),
        );

        return new DtoValidationException(errorMessages.join(', '));
      },
    }),
  );

  await app.get(RoleSeeder).seed();

  await app.listen(port);
}
bootstrap();
