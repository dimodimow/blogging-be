import { ApiProperty } from '@nestjs/swagger';

export class RemoveRolesFromUserDto {
  @ApiProperty({ required: true })
  roleIds: string[];

  @ApiProperty({ required: true })
  userId: string;
}
