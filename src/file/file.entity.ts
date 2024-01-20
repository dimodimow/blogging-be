import { Base } from 'src/base/base.entity';
import { Blog } from 'src/blog/blog.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class File extends Base {
  @Column()
  url: string;
  @Column()
  name: string;

  @ManyToOne(() => Blog, (blog) => blog.files)
  blog: Blog;
}
