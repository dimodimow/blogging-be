import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { UserService } from 'src/user/user.service';
import { comparePassword } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EntityNotFoundException } from 'src/utils/exceptions/entity-not-found.exception';
import { SignInResponseDto } from './dto/sign-in-response.dto';
import {
  Invalid_Credentials,
  USER,
} from 'src/utils/constants/exception.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInRequestDto: SignInRequestDto): Promise<SignInResponseDto> {
    const { userId, username, userRoleNames } =
      await this.validateUser(signInRequestDto);

    const payload = { roles: userRoleNames, username, userId: userId };
    const accessToken = await this.jwtService.signAsync(payload);

    return new SignInResponseDto(accessToken);
  }

  private async validateUser(
    signInRequestDto: SignInRequestDto,
  ): Promise<{ userId: string; username: string; userRoleNames: string[] }> {
    const user = await this.userService.findByUsernameAsync(
      signInRequestDto.username,
    );

    if (!user) {
      throw new EntityNotFoundException(
        USER,
        'username',
        signInRequestDto.username,
      );
    }

    const arePasswordMatched = await comparePassword(
      signInRequestDto.password,
      user.password,
    );

    if (!arePasswordMatched) {
      throw new UnauthorizedException(Invalid_Credentials);
    }

    return {
      userId: user.id,
      username: user.username,
      userRoleNames: user.roles.map((r) => r.name),
    };
  }
}
