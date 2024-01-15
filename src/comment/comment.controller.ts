import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  async getByBlogId(@Body('blogId') blogId: string) {
    return await this.commentService.getByBlogIdAsync(blogId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.commentService.getByIdAsync(id);
  }

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentService.createAsync(createCommentDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body('content') content: string) {
    return await this.commentService.updateAsync(id, content);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    console.log('id', id);
    return await this.commentService.removeAsync(id);
  }
}
