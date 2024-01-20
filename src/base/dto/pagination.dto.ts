import { Min } from 'class-validator';

export class PaginationDto {
  @Min(1, { message: 'Page must be greater than 0' })
  page: number;
  @Min(5, { message: 'Limit must be minimum 5' })
  limit: number = 10;
}
