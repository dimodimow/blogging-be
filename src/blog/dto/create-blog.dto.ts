import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty()
  @Length(0, 150, { message: 'title is too long' })
  title: string;
  @ApiProperty({ nullable: true })
  content?: string;
  @ApiProperty({ nullable: true })
  tagNames?: string[];
}
