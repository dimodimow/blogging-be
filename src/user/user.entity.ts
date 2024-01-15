import { Base } from 'src/base/base.entity';
import { Blog } from 'src/blog/blog.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class User extends Base {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];

  @ManyToMany(() => Blog)
  @JoinTable()
  favorites: Blog[];
}
