import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { RoleService } from './role.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Role')
@Roles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  async create(@Body('name') name: string) {
    return await this.roleService.createAsync(name);
  }

  @Delete('delete')
  async remove(@Body('id') id: string) {
    return await this.roleService.deleteAsync(id);
  }
}
