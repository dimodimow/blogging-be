import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class CommentRequestDto {
  @ApiProperty({ required: true })
  @MaxLength(350)
  content: string;
}
