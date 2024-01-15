import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/utils/bcrypt';
import { BlogService } from 'src/blog/blog.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly blogService: BlogService,
  ) {}

  async createAsync(createUserDto: CreateUserDto) {
    const password = await hashPassword(createUserDto.password);

    const newUser = this.userRepository.create({ ...createUserDto, password });

    await this.userRepository.save(newUser);
  }

  async findByUsernameAsync(username: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.blogs', 'blog')
      .leftJoinAndSelect('user.favorites', 'favorite')
      .where('user.username = :username', { username })
      .getOne();
  }

  async addFavoriteAsync(userId: string, blogId: string) {
    const user = await this.findByUsernameAsync(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const blog = await this.blogService.findOneByIdAsync(blogId);

    if (!blog) {
      throw new Error('Blog not found');
    }

    if (user.favorites.some((x) => x.id === blog.id)) {
      return;
    }

    user.favorites = [...user.favorites, blog];

    await this.userRepository.save(user);
  }

  async removeFavoriteAsync(userId: string, blogId: string) {
    const user = await this.findByUsernameAsync(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const blog = await this.blogService.findOneByIdAsync(blogId);

    if (!blog) {
      throw new Error('Blog not found');
    }

    user.favorites = user.favorites.filter((x) => x.id !== blog.id);

    await this.userRepository.save(user);
  }
}
