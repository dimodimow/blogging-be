export class CreateFileDto {
  constructor(url: string, name: string) {
    this.url = url;
    this.name = name;
  }

  url: string;
  name: string;
}
