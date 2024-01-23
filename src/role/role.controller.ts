import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { RoleService } from './role.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role as RoleEntity } from './role.entity';
import CreateRoleDto from './dto/create-role.dto';
import { DeleteRoleDto } from './dto/delete-role.dto';
import { RoleDto } from './dto/role.dto';

@ApiTags('Role')
@ApiBearerAuth()
@Roles(Role.Admin, Role.User)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleDto> {
    return await this.roleService.createAsync(createRoleDto.name);
  }

  @Delete('delete')
  async remove(@Body() deleteRoleDto: DeleteRoleDto): Promise<void> {
    return await this.roleService.deleteAsync(deleteRoleDto.id);
  }

  @Get('find')
  async findAsync(): Promise<RoleDto[]> {
    return await this.roleService.findAsync();
  }
}
