export default class UploadFileDto {
  constructor(name: string, buffer: Buffer, mimeType: string) {
    this.name = name;
    this.buffer = buffer;
    this.mimeType = mimeType;
  }

  name: string;
  buffer: Buffer;
  mimeType: string;
}
