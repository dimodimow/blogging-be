import { ApiProperty } from '@nestjs/swagger';

export class DeleteTagsDto {
  @ApiProperty({ required: true })
  names: string[];
}
