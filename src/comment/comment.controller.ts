import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { Comment } from './comment.entity';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/role.enum';

@ApiTags('Comment')
@Controller('comment')
@Roles(Role.Admin, Role.User)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('getByBlogId')
  async getByBlogId(@Body('blogId') blogId: string): Promise<Comment[]> {
    return await this.commentService.getByBlogIdAsync(blogId);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Comment> {
    return await this.commentService.getByIdAsync(id);
  }

  @Post('create')
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ): Promise<Comment> {
    const userId = req.userId;
    return await this.commentService.createAsync(createCommentDto, userId);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body('content') content: string,
  ): Promise<Comment> {
    return await this.commentService.updateAsync(id, content);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string): Promise<void> {
    console.log('id', id);
    return await this.commentService.removeAsync(id);
  }
}
