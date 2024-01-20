import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { RoleService } from './role.service';
import { ApiTags } from '@nestjs/swagger';
import { Role as RoleEntity } from './role.entity';

@ApiTags('Role')
@Roles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  async create(@Body('name') name: string): Promise<RoleEntity> {
    return await this.roleService.createAsync(name);
  }

  @Delete('delete')
  async remove(@Body('id') id: string): Promise<void> {
    return await this.roleService.deleteAsync(id);
  }
}
