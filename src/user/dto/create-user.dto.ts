import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @Length(0, 200, { message: 'First name is too long' })
  firstName: string;

  @Length(0, 200, { message: 'Last name is too long' })
  lastName: string;

  @Length(0, 200, { message: 'Username is too long' })
  username: string;

  password: string;

  @IsEmail({ ignore_max_length: true }, { message: 'Email is invalid' })
  @Length(1, 200, { message: 'Email is too long' })
  @Length(0, undefined, { message: 'Email is required' })
  email: string;
}
