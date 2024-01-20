import { Base } from 'src/base/base.entity';
import { Blog } from 'src/blog/blog.entity';
import { Comment } from 'src/comment/comment.entity';
import { Role } from 'src/role/role.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class User extends Base {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];

  @ManyToMany(() => Blog)
  @JoinTable()
  favorites: Blog[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];
}
