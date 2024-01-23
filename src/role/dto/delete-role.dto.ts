import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
}
