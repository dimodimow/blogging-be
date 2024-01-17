import { HttpException } from '@nestjs/common';
//TODO: use this exception in every service
export class EntityNotFoundException extends HttpException {
  constructor(entityName: string, entityIdentifier: string) {
    super(`${entityName} with id ${entityIdentifier} is not found`, 404);
  }
}
