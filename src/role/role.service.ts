import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { In, Repository } from 'typeorm';
import { EntityNotFoundException } from 'src/utils/exceptions/entity-not-found.exception';
import { BusinessException } from 'src/utils/exceptions/business.exception';
import {
  ROLE,
  ROLE_ALREADY_EXISTS,
} from 'src/utils/constants/exception.constants';
import { RoleDto } from './dto/role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async createAsync(name: string): Promise<RoleDto> {
    const roleExists = await this.roleRepository.findOneBy({ name });

    if (roleExists) {
      throw new BusinessException(ROLE_ALREADY_EXISTS);
    }

    const newRole = this.roleRepository.create({ name });
    await this.roleRepository.save(newRole);

    return newRole;
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

  async findByIdsAsync(ids: string[]): Promise<Role[]> {
    return await this.roleRepository.findBy({ id: In(ids) });
  }

  async findOneByIdAsync(id: string): Promise<Role> {
    const role = await this.roleRepository.findOneBy({ id });

    if (!role) {
      throw new EntityNotFoundException(ROLE, 'id', id);
    }

    return role;
  }

  async findAsync(): Promise<RoleDto[]> {
    const roles = await this.roleRepository.find();

    return roles.map((role) => new RoleDto(role));
  }
}
