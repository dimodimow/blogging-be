import { HttpException } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string) {
    super(message, 500);
  }
}
