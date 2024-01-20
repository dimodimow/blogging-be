import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { EntityNotFoundException } from 'src/utils/exceptions/entity-not-found.exception';
import { BusinessException } from 'src/utils/exceptions/business.exception';
import {
  ROLE,
  ROLE_ALREADY_EXISTS,
} from 'src/utils/constants/exception.constants';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async createAsync(name: string): Promise<Role> {
    const roleExists = await this.roleRepository.findOneBy({ name });

    if (roleExists) {
      throw new BusinessException(ROLE_ALREADY_EXISTS);
    }

    const newRole = this.roleRepository.create({ name });

    return await this.roleRepository.save(newRole);
  }

  async deleteAsync(id: string): Promise<void> {
    const role = await this.findOneByIdAsync(id);

    await this.roleRepository.remove(role);
  }

  async findOneByNameAsync(name: string): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ name });

    if (!role) {
      throw new EntityNotFoundException(ROLE, 'name', name);
    }

    return role;
  }

  async findOneByIdAsync(id: string): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });

    if (!role) {
      throw new EntityNotFoundException(ROLE, 'id', id);
    }

    return role;
  }
}
