import { Base } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Role extends Base {
  @Column({ unique: true })
  name: string;
}
