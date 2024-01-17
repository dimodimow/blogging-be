import { HttpException } from '@nestjs/common';

export class DtoValidationException extends HttpException {
  constructor(messages: string) {
    super(messages, 400);
  }
}
