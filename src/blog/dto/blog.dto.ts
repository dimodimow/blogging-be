import { UserBaseDto } from 'src/user/dto/user-base.dto';
import { Blog } from '../blog.entity';
import { CommentDto } from 'src/comment/dto/comment.dto';

export class BlogDto {
  constructor(blog: Blog) {
    this.id = blog.id;
    this.title = blog.title;
    this.content = blog.content;
    this.published = blog.published;
    this.user = new UserBaseDto(blog.user);
    this.tags = blog.tags?.map((tag) => tag.name);
    this.fileUrls = blog.files?.map((file) => file.url);
    this.comments = blog.comments?.map((comment) => new CommentDto(comment));
  }

  id: string;
  title: string;
  content: string;
  published: boolean;
  comments: CommentDto[];
  user: UserBaseDto;
  tags: string[];
  fileUrls: string[];
}
