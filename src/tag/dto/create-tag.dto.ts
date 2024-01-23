import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  name: string;
}
