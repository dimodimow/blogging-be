import { Base } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Tag extends Base {
  @Column()
  name: string;
}
