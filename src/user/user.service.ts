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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => BlogService))
    private readonly blogService: BlogService,
    private readonly roleService: RoleService,
  ) {}

  async createAsync(createUserDto: CreateUserDto): Promise<User> {
    const password = await hashPassword(createUserDto.password);

    const existingUserByEmail = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (existingUserByEmail) {
      throw new BusinessException('User with this email already exists');
    }

    const existingUsername = await this.userRepository.findOneBy({
      username: createUserDto.username,
    });

    if (existingUsername) {
      throw new BusinessException('User with this username already exists');
    }

    const userRole = await this.roleService.findOneByNameAsync('User');

    const newUser = this.userRepository.create({
      ...createUserDto,
      password,
      roles: [userRole],
    });

    await this.userRepository.save(newUser);

    return newUser;
  }

  async findOneByIdAsync(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new EntityNotFoundException('User', 'id', id);
    }

    return user;
  }

  async findByUsernameAsync(username: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.blogs', 'blog')
      .leftJoinAndSelect('user.favorites', 'favorite')
      .leftJoinAndSelect('user.roles', 'role')
      .where('user.username = :username', { username })
      .getOne();
  }

  async addFavoriteAsync(userId: string, blogId: string) {
    const user = await this.findOneByIdAsync(userId);

    const blog = await this.blogService.findOneByIdAsync(blogId);

    if (!blog) {
      throw new EntityNotFoundException('Blog', 'id', blogId);
    }

    if (user.favorites.some((x) => x.id === blog.id)) {
      return;
    }

    user.favorites = [...user.favorites, blog];

    await this.userRepository.save(user);
  }

  async removeFavoriteAsync(userId: string, blogId: string) {
    const user = await this.findOneByIdAsync(userId);

    const blog = await this.blogService.findOneByIdAsync(blogId);

    if (!blog) {
      throw new EntityNotFoundException('Blog', 'id', blogId);
    }

    user.favorites = user.favorites.filter((x) => x.id !== blog.id);

    await this.userRepository.save(user);
  }

  async addRoleToUserAsync(userId: string, roleId: string) {
    const user = await this.findOneByIdAsync(userId);

    const role = await this.roleService.findOneByIdAsync(roleId);

    if (user.roles.some((x) => x.id === role.id)) {
      throw new BusinessException('User already has this role');
    }

    user.roles = [...user.roles, role];

    await this.userRepository.save(user);
  }

  async removeRoleFromUserAsync(userId: string, roleId: string) {
    const user = await this.findOneByIdAsync(userId);

    const role = await this.roleService.findOneByIdAsync(roleId);

    if (!user.roles.some((x) => x.id === role.id)) {
      throw new BusinessException('User does not have this role');
    }

    user.roles = user.roles.filter((x) => x.id !== role.id);

    await this.userRepository.save(user);
  }
}
