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
import { CommentRequestDto } from './dto/comment-request.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { CommentDto } from './dto/comment.dto';

@ApiTags('Comment')
@ApiBearerAuth()
@Controller('comment')
@Roles(Role.Admin, Role.User)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('findByBlogId/:blogId')
  async findByBlogId(@Param('blogId') blogId: string): Promise<CommentDto[]> {
    return await this.commentService.findByBlogIdAsync(blogId);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<CommentDto> {
    return new CommentDto(await this.commentService.findByIdAsync(id));
  }

  @Post('create/:blogId')
  async create(
    @Param('blogId') blogId: string,
    @Body() commentRequestDto: CommentRequestDto,
    @Request() req,
  ): Promise<CommentDto> {
    const { userId } = req.user;

    return await this.commentService.createAsync(
      commentRequestDto,
      userId,
      blogId,
    );
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() commentRequestDto: CommentRequestDto,
  ): Promise<CommentDto> {
    return await this.commentService.updateAsync(id, commentRequestDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.commentService.removeAsync(id);
  }
}
