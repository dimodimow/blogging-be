import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { UserService } from 'src/user/user.service';
import { comparePassword } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EntityNotFoundException } from 'src/utils/exceptions/entity-not-found.exception';
import { SignInResponseDto } from './dto/sign-in-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInRequestDto: SignInRequestDto): Promise<SignInResponseDto> {
    const { userId, userRoleNames } = await this.validateUser(signInRequestDto);

    const payload = { roles: userRoleNames, userId: userId };
    console.log(payload);
    const accessToken = await this.jwtService.signAsync(payload);

    return new SignInResponseDto(accessToken);
  }

  private async validateUser(
    signInRequestDto: SignInRequestDto,
  ): Promise<{ userId: string; userRoleNames: string[] }> {
    const user = await this.userService.findByUsernameAsync(
      signInRequestDto.username,
    );

    if (!user) {
      throw new EntityNotFoundException(
        'User',
        'username',
        signInRequestDto.username,
      );
    }

    const arePasswordMatched = await comparePassword(
      signInRequestDto.password,
      user.password,
    );

    if (!arePasswordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { userId: user.id, userRoleNames: user.roles.map((r) => r.name) };
  }
}
