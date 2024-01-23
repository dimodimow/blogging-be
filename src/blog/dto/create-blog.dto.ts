import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(150, { message: 'title is too long' })
  title: string;

  @ApiProperty({ nullable: true })
  content?: string;

  @ApiProperty({ nullable: true })
  tagNames?: string[];
}
