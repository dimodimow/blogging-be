import { User } from 'src/user/user.entity';

export class UserBaseDto {
  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
  }

  id: string;
  username: string;
}
