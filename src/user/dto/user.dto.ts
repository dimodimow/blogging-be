import { User } from '../user.entity';
import { UserBaseDto } from './user-base.dto';

export class UserDto extends UserBaseDto {
  constructor(user: User) {
    super(user);

    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.roles = user.roles?.map((role) => role.name);
    this.blogIds = user.blogs?.map((blog) => blog.id);
    this.favoriteIds = user.favorites?.map((favorite) => favorite.id);
  }

  firstName: string;
  lastName: string;
  roles: string[];
  blogIds: string[];
  favoriteIds: string[];
}
