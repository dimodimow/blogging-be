import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(200, { message: 'First name is too long' })
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(200, { message: 'Last name is too long' })
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(30, { message: 'Username is too long' })
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;
}
