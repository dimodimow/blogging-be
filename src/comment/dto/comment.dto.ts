import { UserBaseDto } from 'src/user/dto/user-base.dto';
import { Comment } from '../comment.entity';

export class CommentDto {
  constructor(comment: Comment) {
    this.id = comment.id;
    this.content = comment.content;
    this.user = new UserBaseDto(comment.user);
  }

  id: string;
  content: string;
  user: UserBaseDto;
}
