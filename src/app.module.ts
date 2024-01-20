import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { CommentModule } from './comment/comment.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TagModule } from './tag/tag.module';
import * as Joi from '@hapi/joi';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './utils/exception-filters/http-exception-filter';
import { RoleModule } from './role/role.module';

@Module({
  controllers: [AppController],
  imports: [
    RoleModule,
    BlogModule,
    CommentModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    TagModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
    }),
  ],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
