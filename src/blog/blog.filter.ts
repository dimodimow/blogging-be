import { ApiProperty } from '@nestjs/swagger';

export class BlogFilter {
  @ApiProperty({ required: false })
  title: string;

  @ApiProperty({ required: false })
  username: string;

  @ApiProperty({ required: false, isArray: true })
  tags: string[];
}
