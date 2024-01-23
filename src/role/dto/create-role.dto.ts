import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export default class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(15)
  name: string;
}
