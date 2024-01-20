import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { RolesGuard } from 'src/utils/guards/roles.guard';

@ApiTags('Tag')
@Controller('tag')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('create')
  @Roles(Role.Admin)
  async create(@Body('name') name: string) {
    return await this.tagService.createAsync(name);
  }

  @Get('getByName')
  @Roles(Role.Admin, Role.User)
  async getByName(@Body('name') name: string) {
    return await this.tagService.getByNameAsync(name);
  }

  @Delete()
  @Roles(Role.Admin)
  async remove(@Body('names') names: string[]) {
    return await this.tagService.removeAsync(names);
  }
}
