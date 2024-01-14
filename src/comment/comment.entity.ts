import { Base } from 'src/base/base.entity';
import { Blog } from 'src/blog/blog.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Comment extends Base {
  @Column({ length: 500 })
  content: string;

  @ManyToOne(() => Blog, (blog) => blog.comments)
  blog: Blog;
}
