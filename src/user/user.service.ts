import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/utils/bcrypt';
import { BlogService } from 'src/blog/blog.service';
import { EntityNotFoundException } from 'src/utils/exceptions/entity-not-found.exception';
import { BusinessException } from 'src/utils/exceptions/business.exception';
import { RoleService } from 'src/role/role.service';
import {
  BLOG,
  USER,
  USER_EMAIL_EXISTS,
  USER_USERNAME_EXISTS,
} from 'src/utils/constants/exception.constants';
import { AddRolesToUserDto } from './dto/add-roles-to-user.dto';
import { RemoveRolesFromUserDto } from './dto/remove-roles-from-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => BlogService))
    private readonly blogService: BlogService,
    private readonly roleService: RoleService,
  ) {}

  async createAsync(createUserDto: CreateUserDto): Promise<UserDto> {
    const password = await hashPassword(createUserDto.password);

    const existingUserByEmail = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existingUserByEmail) {
      throw new BusinessException(USER_EMAIL_EXISTS);
    }

    const existingUsername = await this.userRepository.findOneBy({
      username: createUserDto.username,
    });

    if (existingUsername) {
      throw new BusinessException(USER_USERNAME_EXISTS);
    }

    const userRole = await this.roleService.findOneByNameAsync(USER);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password,
      roles: [userRole],
    });

    await this.userRepository.save(newUser);

    return new UserDto(newUser);
  }

  async findOneByIdAsync(id: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.blogs', 'blog')
      .leftJoinAndSelect('user.favorites', 'favorite')
      .leftJoinAndSelect('user.roles', 'role')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new EntityNotFoundException(USER, 'id', id);
    }

    return user;
  }

  async findByUsernameAsync(username: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.blogs', 'blog')
      .leftJoinAndSelect('user.favorites', 'favorite')
      .leftJoinAndSelect('user.roles', 'role')
      .where('user.username = :username', { username })
      .getOne();

    if (!user) {
      throw new EntityNotFoundException(USER, 'username', username);
    }

    return user;
  }

  async addFavoriteAsync(userId: string, blogId: string) {
    const user = await this.findOneByIdAsync(userId);

    const blog = await this.blogService.findOneByIdAsync(blogId);

    if (!blog) {
      throw new EntityNotFoundException(BLOG, 'id', blogId);
    }

    if (user.favorites.some((x) => x.id === blog.id)) {
      return;
    }

    user.favorites = [...user.favorites, blog];

    await this.userRepository.save(user);
  }

  async addRolesToUserAsync(
    addRolesToUserDto: AddRolesToUserDto,
  ): Promise<void> {
    console.log(addRolesToUserDto.userId);
    const user = await this.findOneByIdAsync(addRolesToUserDto.userId);
    console.log(user);
    const roles = await this.roleService.findByIdsAsync(
      addRolesToUserDto.roleIds,
    );
    console.log(roles);
    console.log(user.roles);
    const newRoles = roles.filter(
      (role) => !user.roles.some((x) => x.id === role.id),
    );

    if (newRoles.length === 0) {
      return;
    }

    user.roles = [...user.roles, ...newRoles];
    await this.userRepository.save(user);
  }

  async removeRolesFromUserAsync(
    removeRolesFromUserDto: RemoveRolesFromUserDto,
  ): Promise<void> {
    const user = await this.findOneByIdAsync(removeRolesFromUserDto.userId);

    const roles = await this.roleService.findByIdsAsync(
      removeRolesFromUserDto.roleIds,
    );

    const rolesToRemove = roles.filter((role) =>
      user.roles.some((x) => x.id === role.id),
    );

    if (rolesToRemove.length === 0) {
      return;
    }

    user.roles = user.roles.filter(
      (role) => !rolesToRemove.some((x) => x.id === role.id),
    );

    await this.userRepository.save(user);
  }

  async removeFavoriteAsync(userId: string, blogId: string): Promise<void> {
    const user = await this.findOneByIdAsync(userId);

    const blog = await this.blogService.findOneByIdAsync(blogId);

    if (!blog) {
      throw new EntityNotFoundException(BLOG, 'id', blogId);
    }

    user.favorites = user.favorites.filter((x) => x.id !== blog.id);

    await this.userRepository.save(user);
  }
}
