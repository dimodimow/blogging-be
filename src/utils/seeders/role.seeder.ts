import { Injectable } from '@nestjs/common';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class RoleSeeder {
  constructor(private readonly roleService: RoleService) {}

  async seed() {
    try {
      await this.roleService.findOneByNameAsync('User');
    } catch (_) {
      await this.roleService.createAsync('User');
    }

    try {
      await this.roleService.findOneByNameAsync('Admin');
    } catch (_) {
      await this.roleService.createAsync('Admin');
    }
  }
}
