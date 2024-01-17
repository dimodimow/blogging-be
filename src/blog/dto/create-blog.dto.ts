import { Length } from 'class-validator';

export class CreateBlogDto {
  @Length(0, 150, { message: 'title is too long' })
  title: string;
  content: string;
  tagNames: string[];
}
