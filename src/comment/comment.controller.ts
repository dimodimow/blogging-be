import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
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
  async getById(@Query('id') id: string) {
    return await this.commentService.getByIdAsync(id);
  }

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentService.createAsync(createCommentDto);
  }

  @Put(':id')
  async update(@Query('id') id: string, @Body('content') content: string) {
    return await this.commentService.updateAsync(id, content);
  }

  @Delete(':id')
  async remove(@Query('id') id: string) {
    return await this.commentService.removeAsync(id);
  }
}
