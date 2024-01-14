import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createAsync(createUserDto: CreateUserDto) {
    const password = await hashPassword(createUserDto.password);

    const newUser = this.userRepository.create({ ...createUserDto, password });

    await this.userRepository.save(newUser);
  }

  async findByUsernameAsync(username: string) {
    return await this.userRepository.findOneBy({ username });
  }
}
