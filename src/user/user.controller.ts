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
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { User } from './user.entity';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.createAsync(createUserDto);
  }

  @Get('getByUsername')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getByUsername(@Query('username') username: string): Promise<User> {
    return await this.userService.findByUsernameAsync(username);
  }

  @Put('addFavorite')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  async addFavorite(
    @Body('blogId') blogId: string,
    @Request() req,
  ): Promise<void> {
    const { userId } = req.user;
    return await this.userService.addFavoriteAsync(userId, blogId);
  }

  @Put('removeFavorite')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  async removeFavorite(
    @Body('blogId') blogId: string,
    @Request() req,
  ): Promise<void> {
    const { userId } = req.user;
    return await this.userService.removeFavoriteAsync(userId, blogId);
  }
}
