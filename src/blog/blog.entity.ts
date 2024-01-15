import { Base } from 'src/base/base.entity';
import { Comment } from 'src/comment/comment.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, OneToMany, ManyToOne, ManyToMany } from 'typeorm';

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
}
