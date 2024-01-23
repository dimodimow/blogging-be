export class FindAllPaginatedResultDto<Dto> {
  constructor(items: Dto[], count: number, pagesLeft: number) {
    this.items = items;
    this.count = count;
    this.pagesLeft = pagesLeft;
  }

  items: Dto[];
  count: number;
  pagesLeft: number;
}
