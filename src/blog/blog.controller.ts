import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogFilter } from './blog.filter';
import { PaginationDto } from 'src/base/dto/pagination.dto';
import { FindAllPaginatedResultDto } from '../base/dto/find-all-paginated-result.dto';
import { Blog } from './blog.entity';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async create(@Body() createBlogDto: CreateBlogDto) {
    return await this.blogService.createAsync(createBlogDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async get(
    @Query() blogFilter: BlogFilter,
    @Query() paginationDto: PaginationDto,
    @Request() req,
  ): Promise<FindAllPaginatedResultDto<Blog>> {
    console.log(req.user);
    return await this.blogService.findAll(blogFilter, paginationDto);
  }

  @Get(':id')
  async findOneById(@Param('id') id: string) {
    return await this.blogService.findOneByIdAsync(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.blogService.removeAsync(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return await this.blogService.updateAsync(id, updateBlogDto);
  }
}
