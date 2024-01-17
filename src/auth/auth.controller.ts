import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async signIn(@Body() signInRequestDto: SignInRequestDto) {
    return await this.authService.signIn(signInRequestDto);
  }
}
