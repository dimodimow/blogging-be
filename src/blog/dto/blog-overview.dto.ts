import { UserBaseDto } from 'src/user/dto/user-base.dto';
import { Blog } from '../blog.entity';

export class BlogOverviewDto {
  constructor(blog: Blog) {
    this.id = blog.id;
    this.title = blog.title;
    this.user = new UserBaseDto(blog.user);
    this.tags = blog.tags.map((tag) => tag.name);
  }

  id: string;
  title: string;
  user: UserBaseDto;
  tags: string[];
}
