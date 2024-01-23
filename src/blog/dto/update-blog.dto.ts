import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class UpdateBlogDto {
  @ApiProperty()
  @MaxLength(150, { message: 'title is too long' })
  title: string;
  @ApiProperty({ nullable: true })
  content: string;
  @ApiProperty()
  published: boolean;
  @ApiProperty({ nullable: true })
  tagNames: string[];
}
