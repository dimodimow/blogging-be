import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class UpdateBlogDto {
  @ApiProperty()
  @Length(0, 150, { message: 'title is too long' })
  title: string;
  @ApiProperty({ nullable: true })
  content: string;
  @ApiProperty()
  published: boolean;
  @ApiProperty({ nullable: true })
  tagNames: string[];
}
