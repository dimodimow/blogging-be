import { HttpException } from '@nestjs/common';

export class EntityNotFoundException extends HttpException {
  constructor(entityName: string, entityIdentifier: string) {
    super(`${entityName} with id ${entityIdentifier} is not found`, 404);
  }
}
