import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { EntityNotFoundException } from 'src/utils/exceptions/entity-not-found.exception';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async createAsync(name: string): Promise<Role> {
    const newRole = this.roleRepository.create({ name });

    return await this.roleRepository.save(newRole);
  }

  async deleteAsync(id: string): Promise<Role> {
    const role = await this.findOneByIdAsync(id);

    return await this.roleRepository.remove(role);
  }

  async findOneByNameAsync(name: string): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ name });

    if (!role) {
      throw new EntityNotFoundException('Role', 'name', name);
    }

    return role;
  }

  async findOneByIdAsync(id: string): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });

    if (!role) {
      throw new EntityNotFoundException('Role', 'id', id);
    }

    return role;
  }
}
