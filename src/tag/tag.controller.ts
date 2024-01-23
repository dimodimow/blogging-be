import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Tag } from './tag.entity';
import { GetTagsDto } from './dto/get-tags.dto';
import { DeleteTagsDto } from './dto/delete-tags.dto';
import { CreateTagDto } from './dto/create-tag.dto';

@ApiTags('Tag')
@ApiBearerAuth()
@Controller('tag')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post('create')
  @Roles(Role.Admin)
  async create(@Body() tagDto: CreateTagDto): Promise<Tag> {
    return await this.tagService.createAsync(tagDto.name);
  }

  @Get('get')
  @Roles(Role.Admin)
  async get(@Query() getTagsDto: GetTagsDto): Promise<Tag[]> {
    return await this.tagService.getAsync(getTagsDto.name);
  }

  @Delete()
  @Roles(Role.Admin)
  async remove(@Body() deleteTagsDto: DeleteTagsDto): Promise<void> {
    return await this.tagService.removeAsync(deleteTagsDto.names);
  }
}
