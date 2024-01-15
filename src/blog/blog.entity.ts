import { Base } from 'src/base/base.entity';
import { Comment } from 'src/comment/comment.entity';
import { Tag } from 'src/tag/tag.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Blog extends Base {
  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: false })
  published: boolean;

  @OneToMany(() => Comment, (comment) => comment.blog)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.blogs)
  user: User;

  @ManyToMany(() => Tag)
  @JoinTable()
  tags: Tag[];
}
