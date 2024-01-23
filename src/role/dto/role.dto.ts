import { Role } from '../role.entity';

export class RoleDto {
  constructor(role: Role) {
    this.id = role.id;
    this.name = role.name;
  }

  id: string;
  name: string;
}
