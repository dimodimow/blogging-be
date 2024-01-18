import { Base } from 'src/base/base.entity';
import { Blog } from 'src/blog/blog.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Comment extends Base {
  @Column({ length: 500 })
  content: string;

  @ManyToOne(() => Blog, (blog) => blog.comments)
  blog: Blog;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;
}
