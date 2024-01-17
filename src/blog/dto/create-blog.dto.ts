import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  tagNames: string[];
}
