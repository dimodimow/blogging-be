import { Body, Controller, Get, Post } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  async create(@Body('name') name: string) {
    return await this.tagService.createAsync(name);
  }

  @Get()
  async getByName(@Body('name') name: string) {
    return await this.tagService.getByNameAsync(name);
  }
}
