import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export default class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(1, 15)
  name: string;
}
