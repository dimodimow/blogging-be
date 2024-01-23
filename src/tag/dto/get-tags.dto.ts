import { ApiProperty } from '@nestjs/swagger';

export class GetTagsDto {
  @ApiProperty({ nullable: true, required: false })
  name: string;
}
