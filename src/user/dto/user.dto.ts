import { User } from '../user.entity';
import { UserBaseDto } from './user-base.dto';

export class UserDto extends UserBaseDto {
  constructor(user: User) {
    super(user);

    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.roles = user.roles.map((role) => role.name);
  }

  firstName: string;
  lastName: string;
  roles: string[];
}
