import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createAsync(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getByUsername(@Query('username') username: string) {
    return await this.userService.findByUsernameAsync(username);
  }

  @Put('addFavorite')
  @UseGuards(JwtAuthGuard)
  async addFavorite(@Body('blogId') blogId: string, @Request() req) {
    const userId = req.userId;
    return await this.userService.addFavoriteAsync(userId, blogId);
  }

  @Put('removeFavorite')
  @UseGuards(JwtAuthGuard)
  async removeFavorite(@Body('blogId') blogId: string, @Request() req) {
    const userId = req.userId;
    return await this.userService.removeFavoriteAsync(userId, blogId);
  }
}
