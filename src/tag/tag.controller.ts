import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';

@ApiTags('Tag')
@Controller('tag')
@UseGuards(JwtAuthGuard)
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

  @Delete()
  async remove(@Body('names') names: string[]) {
    return await this.tagService.removeAsync(names);
  }
}
