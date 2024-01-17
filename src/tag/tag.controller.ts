import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  async create(@Body('name') name: string) {
    return await this.tagService.createAsync(name);
  }

  @Get()
  async getByName(@Body('name') name: string) {
    throw new NotFoundException('Tag not found', {
      description: 'Tag not found',
    });
    return await this.tagService.getByNameAsync(name);
  }

  @Delete()
  async remove(@Body('names') names: string[]) {
    return await this.tagService.removeAsync(names);
  }
}
