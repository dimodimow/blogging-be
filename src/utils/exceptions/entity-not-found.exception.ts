import { HttpException } from '@nestjs/common';
//TODO: use this exception in every service

type EntitySearchParam = 'id' | 'name' | 'username';

export class EntityNotFoundException extends HttpException {
  constructor(
    entityName: string,
    entitySearchParam: EntitySearchParam,
    param: string,
  ) {
    super(`${entityName} with ${entitySearchParam} ${param} is not found`, 404);
  }
}
