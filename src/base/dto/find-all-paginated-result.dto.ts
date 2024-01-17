import { Base } from '../base.entity';

export class FindAllPaginatedResultDto<Entity extends Base> {
  constructor(items: Entity[], count: number, pagesLeft: number) {
    this.items = items;
    this.count = count;
    this.pagesLeft = pagesLeft;
  }

  items: Entity[];
  count: number;
  pagesLeft: number;
}
