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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { User } from './user.entity';
import { AddRolesToUserDto } from './dto/add-roles-to-user.dto';
import { RemoveRolesFromUserDto } from './dto/remove-roles-from-user.dto';
import { FavoriteRequestDto } from './dto/favorite-request.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return await this.userService.createAsync(createUserDto);
  }

  @Get('getByUsername')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getByUsername(@Query('username') username: string): Promise<UserDto> {
    return new UserDto(await this.userService.findByUsernameAsync(username));
  }

  @Put('addRolesToUser')
  @UseGuards(JwtAuthGuard)
  async addRolesToUser(
    @Body() addRolesToUserDto: AddRolesToUserDto,
  ): Promise<void> {
    return await this.userService.addRolesToUserAsync(addRolesToUserDto);
  }

  @Put('removeRolesFromUser')
  async removeRolesFromUser(
    @Body() removeRolesFromUserDto: RemoveRolesFromUserDto,
  ): Promise<void> {
    return await this.userService.removeRolesFromUserAsync(
      removeRolesFromUserDto,
    );
  }

  @Put('addFavorite')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  async addFavorite(
    @Query() favoriteRequestDto: FavoriteRequestDto,
    @Request() req,
  ): Promise<void> {
    const { userId } = req.user;
    return await this.userService.addFavoriteAsync(
      userId,
      favoriteRequestDto.blogId,
    );
  }

  @Put('removeFavorite')
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  async removeFavorite(
    @Query() favoriteRequestDto: FavoriteRequestDto,
    @Request() req,
  ): Promise<void> {
    const { userId } = req.user;
    return await this.userService.removeFavoriteAsync(
      userId,
      favoriteRequestDto.blogId,
    );
  }
}
