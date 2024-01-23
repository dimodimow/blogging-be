import { ApiProperty } from '@nestjs/swagger';

export class FavoriteRequestDto {
  @ApiProperty({ required: true })
  blogId: string;
}
