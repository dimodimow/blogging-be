import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createAsync(createUserDto);
  }

  @Get()
  async getByUsername(@Query('username') username: string) {
    return await this.userService.findByUsernameAsync(username);
  }

  //todo: get id from token instead of username
  @Put('addFavorite')
  async addFavorite(
    @Query('username') username: string,
    @Body('blogId') blogId: string,
  ) {
    return await this.userService.addFavoriteAsync(username, blogId);
  }

  @Put('removeFavorite')
  async removeFavorite(
    @Query('username') username: string,
    @Body('blogId') blogId: string,
  ) {
    return await this.userService.removeFavoriteAsync(username, blogId);
  }
}
