import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { UserModule } from 'src/user/user.module';
import { BlogModule } from 'src/blog/blog.module';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [UserModule, BlogModule, FileModule],
  providers: [S3Service],
  controllers: [S3Controller],
})
export class S3Module {}
