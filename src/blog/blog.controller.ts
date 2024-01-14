import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async create(@Body() createBlogDto: CreateBlogDto) {
    return await this.blogService.create(createBlogDto);
  }

  @Get()
  async get() {
    return await this.blogService.findAll();
  }

  @Delete(':id')
  async delete(@Query('id') id: string) {
    return await this.blogService.remove(id);
  }

  @Put(':id')
  async update(@Query('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return await this.blogService.update(id, updateBlogDto);
  }
}
