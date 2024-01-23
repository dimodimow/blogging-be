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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { BlogDto } from './dto/blog.dto';
import { BlogOverviewDto } from './dto/blog-overview.dto';

@ApiTags('Blog')
@ApiBearerAuth()
@Controller('blog')
@Roles(Role.Admin, Role.User)
@UseGuards(JwtAuthGuard, RolesGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('create')
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @Request() req,
  ): Promise<BlogDto> {
    const userId = req.userId;
    return await this.blogService.createAsync(createBlogDto, userId);
  }

  @Get('find')
  async find(
    @Query() blogFilter: BlogFilter,
    @Query() paginationDto: PaginationDto,
  ): Promise<FindAllPaginatedResultDto<BlogOverviewDto>> {
    return await this.blogService.find(blogFilter, paginationDto);
  }

  @Get('findOneById/:id')
  async findOneById(@Param('id') id: string): Promise<BlogDto> {
    return new BlogDto(await this.blogService.findOneByIdAsync(id));
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string): Promise<void> {
    return await this.blogService.removeAsync(id);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<BlogDto> {
    return await this.blogService.updateAsync(id, updateBlogDto);
  }
}
