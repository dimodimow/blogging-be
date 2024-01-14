import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { UserService } from 'src/user/user.service';
import { comparePassword } from 'src/utils/bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInRequestDto: SignInRequestDto) {
    const user = await this.userService.findByUsername(
      signInRequestDto.username,
    );

    if (!user) {
      return null;
    }

    const arePasswordMatched = await comparePassword(
      signInRequestDto.password,
      user.password,
    );

    if (!arePasswordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken({
      sub: user.id,
      username: user.username,
    });
    return { key: token };
  }

  async generateToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verify(token);
  }
}
