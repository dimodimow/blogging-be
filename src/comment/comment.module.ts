import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { BlogModule } from 'src/blog/blog.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), BlogModule, UserModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
